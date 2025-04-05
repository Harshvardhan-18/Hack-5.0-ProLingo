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

  const handleCreateRoom = async () => {
    setIsCreating(true);
    const userId = 'current-user-id'; // Replace with actual user ID from auth
    const roomId = await createQuizRoom(userId);
    router.push(`/quiz/${roomId}`);
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
