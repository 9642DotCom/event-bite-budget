
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-background border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden sm:flex items-center gap-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Logado como: <span className="font-medium text-foreground">{user.email}</span>
          </span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={signOut}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </header>
  );
};
