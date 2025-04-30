'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createQuizRoom } from '@/actions/createQuizRoom'; // adjust path if needed
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function QuizHome() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    const userId = 'current-user-id'; 
    const roomId = await createQuizRoom(userId);
    setCreatedRoomCode(roomId);
  
 
    setTimeout(() => {
      router.push(`/quiz/${roomId}`);
    }, 6000); 
  };
  
  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/quiz/${roomCode}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-6">Join or Create a Quiz Room</h1>

          <div className="flex flex-col gap-4">
            <Button onClick={handleCreateRoom} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Room'}
            </Button>
            {createdRoomCode && (
              <div className="text-center text-green-600 font-semibold">
                Room Code: {createdRoomCode}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <Button onClick={handleJoinRoom}>Join</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
