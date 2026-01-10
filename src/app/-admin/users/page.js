"use client";

import { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search, Mail, Shield, User, Filter, MoreVertical, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Store <span className="text-primary italic">Community</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">
            User & Audience Management Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 px-2 py-0.5 rounded-2xl border border-primary/20 backdrop-blur-sm">
                <span className="text-xs  text-primary uppercase tracking-widest">{users.length} Records</span>
            </div>
        </div>
      </div>

      {/* Control Bar */}
      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-md">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or email..."
              className="pl-11 h-12 bg-muted/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
             <div className="h-10 w-10 bg-muted flex items-center justify-center rounded-xl cursor-not-allowed opacity-50">
                <Filter className="h-4 w-4" />
             </div>
             <div className="h-px w-6 bg-border rotate-90 hidden md:block" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:block">
                Real-time Sync Active
             </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Table Content */}
      <Card className="border-none shadow-2xl  bg-card overflow-hidden rounded-3xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b-muted-foreground/10">
                  <TableHead className="w-[100px] h-14 text-[11px] font-bold uppercase tracking-widest text-primary pl-8">Identity</TableHead>
                  <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-primary">Full Name & ID</TableHead>
                  <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-primary">Secure Contact</TableHead>
                  <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-primary">Privileges</TableHead>
                  <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-primary pr-8 text-right">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <TableRow 
                        key={user._id} 
                        className="group hover:bg-muted/20 border-b-muted-foreground/5 transition-all duration-300"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <TableCell className="py-4 pl-8">
                        <div className="relative inline-block">
                            <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-primary/5 shadow-md transition-transform group-hover:scale-110 duration-500">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-black text-lg">
                                {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono bg-muted w-fit px-1.5 py-0.5 rounded uppercase font-bold">
                            IDX: {user._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/mail">
                          <div className="p-1.5 bg-muted rounded-lg group-hover/mail:bg-primary/10 group-hover/mail:text-primary transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm border-b border-transparent hover:border-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          {user.email === process.env.ADMIN_EMAIL ? (
                            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1 rounded-full animate-pulse shadow-sm">
                              <Shield className="w-3.5 h-3.5 fill-amber-500/20" />
                              <span className="text-[10px] font-black uppercase tracking-tighter">System Administrator</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 px-3 py-1 rounded-full group-hover:bg-blue-500/20 transition-colors">
                              <User className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-semibold uppercase ">Verified Member</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 pr-8 text-right">
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">Store Entry</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-16 w-16 bg-muted rounded-3xl flex items-center justify-center">
                            <Search className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <p className="font-bold text-muted-foreground">No matches found for "{searchQuery}"</p>
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="text-primary text-xs font-black uppercase tracking-widest hover:underline"
                        >
                            Reset Filter
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Page Info Footer */}
      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] px-2">
        <span>Displaying {filteredUsers.length} of {users.length} Database Records</span>
        <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Report Issue</span>
        </div>
      </div>
    </div>
  );
}
