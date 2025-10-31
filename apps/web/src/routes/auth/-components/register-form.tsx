import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { registerSchema, type RegisterFormData } from '@/http/auth/dto/auth.dto'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useQueryState(
    'isLoading',
    parseAsBoolean.withDefault(false),
  )
  const [error, setError] = useQueryState('error', parseAsString)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    await setIsLoading(true)
    await setError(null)

    try {
      await registerUser(data)
      reset()

      toast.success('Registration successful! Please log in.')
      navigate({
        to: '/auth/login',
        search: {
          postRegister: 'true',
        },
      })
    } catch (err) {
      await setError('Registration failed. Please try again.')
      await setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create an account</CardTitle>
          <CardDescription>
            Cadastre-se para começar a gerenciar suas tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Preencha os dados abaixo
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor='username'>Username</FieldLabel>
                <Input
                  id='username'
                  type='text'
                  placeholder='johndoe'
                  {...register('username')}
                />
                {errors.username && (
                  <FieldDescription className='text-red-500'>
                    {errors.username.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='johndoe@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <FieldDescription className='text-red-500'>
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor='password'>Senha</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  placeholder='strongpassword123'
                  {...register('password')}
                />
                {errors.password && (
                  <FieldDescription className='text-red-500'>
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              {error && (
                <FieldDescription className='text-red-500'>
                  {error}
                </FieldDescription>
              )}
              <Field>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
                <FieldDescription className='text-center'>
                  Já tem uma conta?{' '}
                  <Link
                    to='/auth/login'
                    className='underline underline-offset-4'
                  >
                    Faça login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className='px-6 text-center'>
        Ao clicar em criar conta, você concorda com nossos{' '}
        <a href='#' className='underline underline-offset-4'>
          Termos de Serviço
        </a>{' '}
        e{' '}
        <a href='#' className='underline underline-offset-4'>
          Política de Privacidade
        </a>
        .
      </FieldDescription>
    </div>
  )
}
