"use client";

interface LeaderBoardProps {
  leaderBoard: any;
  user: any;
}

const LeaderBoard = ({ leaderBoard, user }: LeaderBoardProps) => {
  if (leaderBoard) {
    return (
      <div className={`w-full md:w-4/12 mb-0 md:mb-0 rounded-3xl shadow-2xl`}>
        <div className='w-full p-8'>
          <h1 className='text-black text-3xl font-semibold mb-4 md:mb-12'>
            Leaderboard
          </h1>
          <div className=' text-xl leading-8'>
            <div className="p-1 grid grid-cols-4 gap-4 text-black font-bold">
              <span>
                No.
              </span>
              <span className="col-span-2">
                User
              </span>
              <span>
                Scores
              </span>
            </div>
            <div>
              {
                leaderBoard?.map((item: any, index: number) => {
                  return (
                    <div key={item.userId} className={`p-1 grid grid-cols-4 gap-4 ${item.user.id === user.id ? 'bg-primary-300' : ''}`}>
                      <span>
                        {index + 1}
                      </span>
                      <span className="col-span-2">
                        {item.user?.name}
                      </span>
                      <span>
                        {item.scores}
                      </span>
                    </div>
                  );
                })
              }
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

export { LeaderBoard };