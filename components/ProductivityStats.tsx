"use client";
import { useEffect, useState } from "react";
import { CheckCircle, BarChart, Calendar, Percent, CalendarDays, BarChart3 } from "lucide-react";

export default function ProductivityStats({ userId }: { userId: number }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
  function refresh() {
    fetch(`/api/stats?userId=${userId}`)
      .then((res) => res.json())
      .then(setStats);
  }

  refresh(); // initial

  window.addEventListener("todo-updated", refresh);
  return () => window.removeEventListener("todo-updated", refresh);
}, [userId]);


  if (!stats) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-white/60 border shadow">
      <h3 className="font-semibold text-indigo-700 mb-2">
        DashBoard
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div className="flex items-center gap-3 bg-white/70 p-4 rounded-xl shadow">
    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
      <CheckCircle size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Completed Today</p>
      <p className="text-xl font-bold">{stats.today}</p>
    </div>
  </div>

  <div className="flex items-center gap-3 bg-white/70 p-4 rounded-xl shadow">
    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
      <BarChart3 size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Total Done</p>
      <p className="text-xl font-bold">{stats.completed}</p>
    </div>
  </div>

  <div className="flex items-center gap-3 bg-white/70 p-4 rounded-xl shadow">
    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
      <CalendarDays size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Completed This Week</p>
      <p className="text-xl font-bold">{stats.week}</p>
    </div>
  </div>

  <div className="flex items-center gap-3 bg-white/70 p-4 rounded-xl shadow">
    <div className="p-2 bg-green-100 rounded-lg text-green-600">
      <Percent size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Completion Rate</p>
      <p className="text-xl font-bold">{stats.rate}%</p>
    </div>
  </div>
</div>

      <div className="mt-3 h-2 w-full bg-gray-200 rounded">
        <div
          className="h-2 bg-indigo-600 rounded"
          style={{ width: `${stats.rate}%` }}
        />
      </div>
    </div>
  );
}
