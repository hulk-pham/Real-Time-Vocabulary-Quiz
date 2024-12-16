"use client";

import { Section } from "@/layout/Section";
import { EVENT_KEY } from "@/utils/app_config";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { JoinQuizForm } from "./JoinQuizForm";
import { LeaderBoard } from "./LeaderBoard";
import { QuestionQuizForm } from "./QuestionQuizForm";
import { QuizSessionInfor } from "./QuizSessionInfor";

const QuizSession = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [_, setTransport] = useState("N/A");
  const [user, setUser] = useState<any>(null);
  const [userScore, setUserScore] = useState<any>(null);
  const [quizSession, setQuizSession] = useState<any>(null);
  const [leaderBoard, setLeaderBoard] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<any>(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [answerResult, setAnswerResult] = useState<any>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const finished = currentQuestionIndex == questions.length;

  function onConnect() {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);
    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }

  function onDisconnect() {
    setIsConnected(false);
    setTransport("N/A");
  }

  function onRetry() {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAnswerResult(null);

    socket.emit(EVENT_KEY.GET_QUIZ_QUESTIONS, {
      quizSessionId: quizSession.id,
    }, (response) => {
      setQuestions(response);
      setCurrentQuestionIndex(0);
    });
  }

  function submitJoinQuizSession(data) {
    socket.emit(EVENT_KEY.JOIN_QUIZ_SESSION, data, (response) => {
      setQuizSession(response.quizSession);
      setUser(response.user);
      setUserScore(response.userScores);

      socket.emit(EVENT_KEY.GET_QUIZ_QUESTIONS, {
        quizSessionId: response.quizSession.id,
      }, (response) => {
        setQuestions(response);
        setCurrentQuestionIndex(0);
      });

      socket.emit(EVENT_KEY.GET_LEADERBOARD, {
        quizSessionId: response.quizSession.id,
      }, (response) => {
        setLeaderBoard(response);
      });
    });
  }

  function onSubmitFormQuestion(data) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    const newAnwers = [...answers, {
      id: currentQuestion.id,
      ...data
    }];

    setAnswers(newAnwers);

    if (currentQuestionIndex === questions.length - 1) {
      socket.emit(EVENT_KEY.SUBMIT_QUIZ_ANSWERS, {
        quizSessionId: userScore.quizSessionId,
        userId: userScore.userId,
        answers: newAnwers,
      }, (response: any) => {
        setLeaderBoard(response.leaderboards);
        setUserScore(response.userScores);
        setAnswerResult(response.userScores);
      });
    }
  }


  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (quizSession) {
      const onLeaderBoardChanges = (response) => {
        setLeaderBoard(response);
      }
      socket.on(`${quizSession.id}/${EVENT_KEY.LEADERBOARD_CHANGES}`, onLeaderBoardChanges);

      return () => {
        socket.off(`${quizSession.id}/${EVENT_KEY.LEADERBOARD_CHANGES}`, onLeaderBoardChanges);
      };
    }

    return () => { };
  }, [quizSession]);



  if (quizSession) {
    return (
      <Section fullWidth yPadding='py-8'>
        <Section className='py-0' yPadding='py-4'>
          <div className=''>
            <QuizSessionInfor
              quizSession={quizSession}
              user={user}
              userScore={userScore}
            />

            <div className="flex justify-between">
              <div className={`w-full md:w-7/12 mb-0 md:mb-0 rounded-2xl shadow-lg`}>
                <div className='w-full p-8'>
                  <h1 className='text-black text-3xl font-semibold mb-4 md:mb-12'>
                    Quiz
                  </h1>
                  <div className='text-xl leading-8'>
                    <div>
                      {!finished && (<p className="text-black">Questions {currentQuestionIndex + 1}/{questions?.length}</p>)}
                      {currentQuestion && !finished && (
                        <div key={currentQuestion.question}>
                          <QuestionQuizForm
                            onSubmit={onSubmitFormQuestion} question={currentQuestion} isLastQuestion={currentQuestionIndex === questions.length - 1} />
                        </div>
                      )}
                      {finished && answerResult && (
                        <div className="text-center mt-12">
                          <p>Your Score</p>
                          <p className="text-5xl text-black mt-12">{answerResult.scores}</p>
                          <button onClick={onRetry} className="bg-primary-500 rounded-md text-white py-2 px-10 text-xl mt-12" >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <LeaderBoard leaderBoard={leaderBoard} user={user} />
            </div>
          </div>
        </Section>
      </Section>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center my-26">
        <p>Connecting...</p>
      </div>
    );
  }

  return (
    <div>
      <JoinQuizForm onSubmit={submitJoinQuizSession} />
    </div>
  );
}

export { QuizSession };
