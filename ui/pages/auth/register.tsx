import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  Button,
  Input,
  Spacer,
  Text,
  Link,
} from "@nextui-org/react";
// import "boxicons";

type CreateUserInput = TypeOf<typeof createUserSchema>;

const createUserSchema = object({
  name: string().nonempty({
    message: "Name is required",
  }),
  password: string()
    .min(6, "Password is too short, it should be at least 6 characters long")
    .nonempty({
      message: "Password is required",
    }),
  passwordConfirmation: string().nonempty({
    message: "Password confirmation is required",
  }),
  email: string({
    required_error: "Email is required",
  })
    .email("Invalid email address")
    .nonempty({
      message: "Password is required",
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

function Register() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: CreateUserInput) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values
      );
      router.push("/");
    } catch (e: any) {
      setRegisterError(e.message);
    }
  }

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            {...register("name")}
          />
          <p>{errors.name?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="*********"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div className="form-element">
          <label htmlFor="passwordConfirmation">Confirm password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="*********"
            {...register("passwordConfirmation")}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default Register;
