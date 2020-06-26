import React, { useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';
import { Container, Content, Background, AnimatedContainer } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const hanldeSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'Mínimo 6 caracteres'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('user', data);

        addToast({
          type: 'success',
          title: 'Cadastro feito!',
          description: 'Você já pode fazer o login!',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Erro ao fazer o cadastro, tente novamente!',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimatedContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={hanldeSubmit}>
            <h1>Faça seu Cadastro</h1>
            <Input icon={FiUser} name="name" placeholder="Nome" />
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Cadastrar</Button>
            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <Link to="/">
            <FiArrowLeft size={20} />
            Voltar para login
          </Link>
        </AnimatedContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
