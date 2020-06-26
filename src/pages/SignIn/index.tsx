import React, { useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { Container, Content, AnimatedContainer, Background } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.svg';

import getValidationErrors from '../../utils/getValidationErros';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubimit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Não foi possivel fazer login na aplicação, tente novamente mais tarde!',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubimit}>
            <h1>Faça seu logon</h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>
            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <Link to="/signup">
            <FiLogIn size={20} />
            Criar conta
          </Link>
        </AnimatedContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
