"use client";

interface QuizSessionInforProps {
  quizSession: any;
  userScore: any;
  user: any;
}

;
const QuizSessionInfor = ({ quizSession, user, userScore }: QuizSessionInforProps) => {

  if (quizSession) {
    return (
      <div className='flex justify-center mb-4'>
        <div className={`w-full mb-0 md:mb-0 rounded-2xl shadow-lg`}>
          <div className='w-full p-8'>
            <div className='text-xl'>
              <div className="grid grid-cols-4">
                <p>Quiz Session: {quizSession.quizId}</p>
                <p>Competitors Number: {quizSession.attendedUsersLength}</p>
                <p>User: {user?.name}</p>
                <p>Score: {userScore?.scores}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <></>
  );
}

export { QuizSessionInfor };