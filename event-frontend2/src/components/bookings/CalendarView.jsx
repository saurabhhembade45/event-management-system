import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarView = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onDateClick = day => setSelectedDate(day);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-white tracking-tight">
        {format(currentDate, 'MMMM yyyy')}
      </h3>
      <div className="flex gap-2">
        <button onClick={prevMonth} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors border border-white/5">
          <ChevronLeft size={18} />
        </button>
        <button onClick={nextMonth} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors border border-white/5">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Find events on this day
        // Ensure accurate comparison by standardizing the timezone logic or doing precise string matching
        // Dummy data dates will be parsed accurately if they are strings like "2026-04-14"
        const dayEvents = events.filter(e => isSameDay(new Date(e.date), cloneDay));
        const hasEvent = dayEvents.length > 0;
        const upcomingEvent = dayEvents.find(e => e.status === 'Upcoming');
        const completedEvent = dayEvents.find(e => e.status === 'Completed');
        
        // Dot color logic
        let dotClass = '';
        if (upcomingEvent) dotClass = 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]';
        else if (completedEvent) dotClass = 'bg-gray-400';

        days.push(
          <div
            key={day}
            onClick={() => onDateClick(cloneDay)}
            className={`
              relative p-2 h-14 border border-white/[0.02] flex flex-col items-center justify-center cursor-pointer transition-all duration-200
              ${!isSameMonth(day, monthStart) ? 'text-gray-600 bg-white/[0.01]' : 'text-gray-300 bg-white/[0.03] hover:bg-indigo-500/10'}
              ${isSameDay(day, selectedDate) ? 'bg-indigo-500/20 border-indigo-500/50 text-white font-bold' : ''}
              ${isSameDay(day, new Date()) && !isSameDay(day, selectedDate) ? 'border-b-2 border-b-indigo-500' : ''}
              group
            `}
          >
            <span className={`text-sm ${isSameDay(day, selectedDate) ? 'text-white' : ''} ${hasEvent ? 'font-bold' : ''}`}>
              {formattedDate}
            </span>
            {hasEvent && (
              <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotClass}`} />
            )}
            
            {/* Tooltip on hover */}
            {hasEvent && (
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded shadow-xl border border-white/10">
                     {dayEvents.map((e, idx) => (
                        <div key={idx} className="whitespace-nowrap">
                           <span className={e.status === 'Upcoming' ? 'text-green-400' : 'text-gray-400'}>●</span> {e.title}
                        </div>
                     ))}
                  </div>
                  <div className="w-2 h-2 bg-slate-800 border-b border-r border-white/10 rotate-45 mx-auto -mt-1 relative z-10" />
               </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="rounded-xl overflow-hidden border border-white/5">{rows}</div>;
  };

  const selectedEvents = events.filter(e => isSameDay(new Date(e.date), selectedDate));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6 border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          {renderHeader()}
          {renderDaysOfWeek()}
          {renderCells()}
          
          <div className="mt-4 flex gap-4 text-xs text-gray-400 font-medium">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400"></div> Upcoming</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Completed</div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 border border-white/10 rounded-2xl p-6 glass-card relative overflow-hidden flex flex-col">
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
        <h4 className="text-lg font-bold text-white mb-4 shadow-sm pb-2 border-b border-white/10">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h4>
        <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">{event.title}</h5>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold whitespace-nowrap ml-2
                      ${event.status === 'Upcoming' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 flex items-center gap-1.5">
                      <Clock size={14} className="opacity-70" /> {event.time}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-sm italic"
              >
                No events currently on this date.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
