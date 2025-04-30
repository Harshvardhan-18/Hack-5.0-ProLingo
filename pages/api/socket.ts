import {Server as SocketIOServer} from 'socket.io';
import { NextApiResponse ,NextApiRequest} from 'next';
import { questions } from '@/questions';

type Player ={id:string;name:string;score?:number;image:string;isHost:boolean;};

const rooms:Record<string,{
    players:Player[],
    currentQuestion:any,
    correctAnswer:number |null,
    questionTimeout:NodeJS.Timeout | null,
}
>={};

export default function SocketHandler(req:NextApiRequest,res:NextApiResponse){
    const anySocket=res.socket as any;
    if(!anySocket){
        res.status(500).end("No socket server found");
        return;
    }

    if(anySocket.server.io){
        console.log("Socket is already running");
        res.end();
        return;
    }

    const io=new SocketIOServer(anySocket.server,{
        path:"/api/socket",
        addTrailingSlash:false,
        cors:{
            origin:"http://localhost:3000",
            methods:["GET","POST"],
        },
    });

    anySocket.server.io = io;

    io.on("connection",(socket)=>{
        console.log("A user connected");

        socket.on("joinRoom",(room,user)=>{
            const {name,image}=user;
            

            if(!rooms[room]){
                rooms[room]={
                    players:[],
                    currentQuestion:null,
                    correctAnswer:null,
                    questionTimeout:null,
                };
            }
            socket.join(room);

            const alreadyExists = rooms[room].players.find(p => p.id === socket.id);
            if (!alreadyExists) {

            const isHost = rooms[room].players.length === 0;

            rooms[room].players.push({
            id: socket.id,
            name,
            image,
            isHost,
            });
            }
            if (!rooms[room]) {
                console.error(`Room ${room} does not exist!`);
                return;
              }
            
              
            io.to(room).emit("roomUpdate", {
                    players: rooms[room].players.map(p => ({
                        id: p.id,
                        name: p.name,
                        image: p.image,
                        isHost: p.isHost,
                    })),
                    hostId: rooms[room].players.find(p => p.isHost)?.id,
            });
            console.log(`${name} joined room: ${room}`);
        });

        socket.on("startQuiz",(room)=>{
                askNewQuestion(room);
            
        })

        socket.on("submitAnswer",(room,answerIndex)=>{
            const currentPlayer=rooms[room].players.find(p=>p.id===socket.id);
            if(!currentPlayer) return;

            const correctIndex=rooms[room].correctAnswer;
            const isCorrect=correctIndex===answerIndex;

            currentPlayer.score=isCorrect?(currentPlayer.score || 0)+1:(currentPlayer.score || 0)-1;

            clearTimeout(rooms[room].questionTimeout!);

            io.to(room).emit("answerResult",{
                playerName:currentPlayer.name,
                isCorrect,
                correctAnswer:correctIndex,
                scores:rooms[room].players.map(p=>({name:p.name,image:p.image,score:p.score||0})),
            });

            const winner=rooms[room].players.find(p=>(p.score || 0)>=5);
            if(winner){
                io.to(room).emit("gameOver",{winner:winner.name});
                delete rooms[room];
            }else{
                askNewQuestion(room);
            }
        });

        socket.on("disconnect",()=>{
            for(const room in rooms){
                rooms[room].players=rooms[room].players.filter(p=>p.id!==socket.id);
            }
            console.log("A user disconnected");
        });
    });

    function askNewQuestion(room:string){
        if(!rooms[room] || rooms[room].players.length===0) return;

        const index =Math.floor(Math.random()*questions.length);
        const q=questions[index];
        const correct=q.answers.findIndex(a=>a.correct);

        rooms[room].currentQuestion=q;
        rooms[room].correctAnswer=correct;

        io.to(room).emit("newQuestion",{
            question:q.question,
            answers:q.answers.map(a=>a.text),
            timer:10,
        });

        rooms[room].questionTimeout=setTimeout(()=>{
            io.to(room).emit("answerResult",{
                playerName:"No one",
                isCorrect:false,
                correctAnswer:correct,
                scores:rooms[room].players.map(p=>({
                    name:p.name,
                    image:p.image,
                    score:p.score||0,
                }))
            })
            askNewQuestion(room);
        },10000);
    }
    res.end();
}