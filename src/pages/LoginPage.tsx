import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const user = await authService.login(data.email, data.password);
      login(user);
      toast.success('Successfully logged in');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <img src="/logo.png" alt="Events Vedika Logo" className="h-32 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#b3395b] via-[#d64f4c] to-[#e7793d] text-transparent bg-clip-text mt-4" style={{ fontFamily: 'cursive, sans-serif' }}>
            Events Vedika
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Use demo credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register('rememberMe')}
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 bg-muted/50 p-6 pt-4 text-sm">
            <div className="w-full">
              <span className="font-semibold text-foreground">Admin:</span>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>mounikasomu@gmail.com</span>
                <span>mouni123</span>
              </div>
            </div>
            <div className="w-full">
              <span className="font-semibold text-foreground">Event Manager:</span>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>manager@gmail.com</span>
                <span>Manager123</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
