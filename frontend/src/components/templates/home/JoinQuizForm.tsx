"use client";

import { Input } from "@/components/atoms/Input";
import { Section } from "@/layout/Section";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import * as yup from "yup";

interface RequestFormProps {
  onSubmit: (data) => void;
}

const schema = yup
  .object({
    userName: yup.string().required('Please enter your name'),
    quizId: yup.string().required('Please enter Quiz Session Id'),
  })
  .required()

const JoinQuizForm = ({ onSubmit }: RequestFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  return (
    <Section fullWidth>
      <Section className='py-0' yPadding='0'>
        <div className='md:mt-12'>
          <div className='flex justify-center'>
            <div className={`w-full md:w-6/12 mb-0 md:mb-0 rounded-3xl shadow-2xl`}>
              <div className='w-full p-8'>
                <h1 className='text-black text-3xl font-semibold mb-4 md:mb-12'>
                  Join Quiz
                </h1>
                <div className='text-xl leading-8'>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                      <Input label={'Quiz Session Id'} field={'quizId'} register={register} errors={errors} placeholder={"Please enter Quiz Session Id"} />
                    </div>
                    <div className="">
                      <Input label={'Name'} field={'userName'} register={register} errors={errors} placeholder={"Please enter your name"} />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="bg-primary-500 rounded-md text-white py-2 px-10 text-xl" >
                        Join
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Section>
  )
};

export { JoinQuizForm };
