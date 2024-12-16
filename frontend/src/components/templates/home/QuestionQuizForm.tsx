"use client";

import { RadioInput } from '@/components/atoms/RadioInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from "yup";

const schema = yup
  .object({
    answer: yup.string().required('Please select an answer'),
  })
  .required()

const QuestionQuizForm = ({ onSubmit, question, isLastQuestion }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={question.question}>
      <p className='mt-4 '>
        {question.question}
      </p>
      <div className="">
        <RadioInput label={''} field={'answer'} register={register} errors={errors} placeholder={""} options={question.options} />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-primary-500 rounded-md text-white py-2 px-10 text-xl" >
          {
            isLastQuestion ? 'Submit' : 'Continue'
          }
        </button>
      </div>
    </form>
  )
}

export { QuestionQuizForm };
