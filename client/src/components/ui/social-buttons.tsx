import { Button } from "./button";
import { Facebook, Github, Mail } from "lucide-react";

interface SocialButtonProps {
  provider: "google" | "facebook" | "apple" | "github";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SocialButton({ provider, onClick, className, disabled }: SocialButtonProps) {
  let icon;
  let text;
  let bgColor;
  
  switch (provider) {
    case "google":
      icon = (
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
      );
      text = "Continue with Google";
      bgColor = "bg-white hover:bg-slate-50";
      break;
    case "facebook":
      icon = <Facebook className="h-5 w-5 mr-2 text-blue-600" />;
      text = "Continue with Facebook";
      bgColor = "bg-white hover:bg-slate-50";
      break;
    case "apple":
      icon = (
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M16.2 0c.97 0 2.12.6 3.15 1.56-2.5 1.3-2.96 4.6-.82 6.45.7.66 1.5 1.17 2.47 1.27-1.9 5-3.1 7.17-5.87 11.72-1.02-.3-1.92-.8-2.75-1.4-1-.76-1.57-1.25-2.5-1.25-.92 0-1.7.64-2.6 1.25-.92.6-1.88 1.3-3.04 1.4-2.25-3.53-3.87-8.04-3.97-12.12-.05-1.22 0-2.4.2-3.5.72-3.53 2.96-5.88 5.77-5.98 1.3.05 2.54.8 3.45 1.45.82.56 1.32.86 1.8.86.45 0 1.08-.35 1.85-.86.82-.5 1.8-1.3 2.85-1.45z"
            fill="currentColor"
          />
        </svg>
      );
      text = "Continue with Apple";
      bgColor = "bg-black hover:bg-gray-900 text-white";
      break;
    case "github":
      icon = <Github className="h-5 w-5 mr-2" />;
      text = "Continue with GitHub";
      bgColor = "bg-gray-900 hover:bg-gray-800 text-white";
      break;
    default:
      icon = <Mail className="h-5 w-5 mr-2" />;
      text = "Continue with Email";
      bgColor = "bg-white hover:bg-slate-50";
  }

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`w-full justify-center ${bgColor} ${className}`}
      disabled={disabled}
    >
      {icon}
      {text}
    </Button>
  );
}