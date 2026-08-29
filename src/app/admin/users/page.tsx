"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Maximize2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminUsersPage() {
  const { usersList, setSelectedUser, handleUpdateRole, actionLoadingId } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.targetRole && u.targetRole.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersList, searchQuery, roleFilter]);

  return (
    <div className="space-y-4">
      {/* Full-Width Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-[#0a0d14] border border-slate-800/80">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, @username, email, or target role..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-400 font-semibold">Role:</span>
          {["all", "user", "pro", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                roleFilter === r
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Comprehensive Full-Width Users Table */}
      <div className="rounded-3xl bg-[#0a0d14] border border-slate-800/80 overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
            <tr>
              <th className="p-4">Developer</th>
              <th className="p-4">Role & Status</th>
              <th className="p-4">Target Role & Focus</th>
              <th className="p-4">XP & Solved</th>
              <th className="p-4">AI Usage Today</th>
              <th className="p-4">Joined / Last Active</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500">
                  No developers match your query.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.uid}
                  className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {u.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={u.photoURL}
                          alt={u.displayName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center shadow-inner">
                          {u.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                          {u.displayName}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {u.email}
                        </span>
                        {u.username && (
                          <span className="text-[10px] text-amber-400 font-mono">
                            @{u.username}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase border ${
                        u.role === "admin"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : u.role === "pro"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-slate-200">{u.targetRole || "Frontend Engineer"}</div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {u.experienceLevel ? u.experienceLevel.toUpperCase() : "JUNIOR"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-mono font-black text-amber-400">{u.xp} XP</div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {u.completedTasks?.length || 0} challenges solved
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300 font-bold">
                        {u.aiUsage?.count || 0} / 100
                      </span>
                      <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            (u.aiUsage?.count || 0) >= 100
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.min(100, ((u.aiUsage?.count || 0) / 100) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-[10px] text-slate-400 font-mono">
                    <div>Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                    <span className="text-slate-500">
                      Active: {new Date(u.lastLoginAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>

                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={u.role}
                        disabled={actionLoadingId === u.uid}
                        onChange={(e) => handleUpdateRole(u.uid, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1 font-mono focus:border-amber-500 focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="pro">Pro</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        onClick={() => setSelectedUser(u)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Open Full Profile"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
