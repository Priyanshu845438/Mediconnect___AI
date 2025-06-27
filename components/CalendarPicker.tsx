import React, { useState } from 'react';

interface CalendarPickerProps {
    onDateTimeSelect: (dateTime: Date) => void;
    onClose: () => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ onDateTimeSelect, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const timeSlots = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    const startDayIndex = firstDayOfMonth.getDay();
    const calendarDays = Array(startDayIndex).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const handlePrevMonth = () => {
        const newViewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // Prevent navigating to a month before the current month
        if (newViewDate < firstDayOfCurrentMonth) return;
        setViewDate(newViewDate);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleDateClick = (day: number | null) => {
        if (!day) return;
        const newSelectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (newSelectedDate < today) return;
        setSelectedDate(newSelectedDate);
        setSelectedTime(null);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const finalDateTime = new Date(selectedDate);
            finalDateTime.setHours(hours, minutes, 0, 0);
            onDateTimeSelect(finalDateTime);
        }
    };
    
    const isPrevMonthDisabled = () => {
        const prevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return prevMonth < firstDayOfCurrentMonth;
    };

    return (
        <div className="p-2 sm:p-4 flex flex-col h-full bg-extralight overflow-y-auto">
            <div className="flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-bold text-center text-primary mb-4">Select Appointment Time</h3>
                
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} disabled={isPrevMonthDisabled()} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">&lt;</button>
                    <span className="font-semibold text-base sm:text-lg text-dark">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">&gt;</button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-sm">
                    {weekDays.map(day => <div key={day} className="font-medium text-gray-500 py-2 text-xs sm:text-sm">{day}</div>)}
                    {calendarDays.map((day, index) => {
                        const currentDate = day ? new Date(viewDate.getFullYear(), viewDate.getMonth(), day) : null;
                        const isPast = currentDate ? currentDate < today : false;
                        const isSelected = selectedDate && day ? selectedDate.toDateString() === currentDate?.toDateString() : false;

                        const baseClasses = "h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full cursor-pointer transition-colors mx-auto";
                        const activeClasses = isSelected ? "bg-primary text-white shadow-lg" : "hover:bg-primary/10";
                        const disabledClasses = "text-gray-400 cursor-not-allowed";

                        return (
                            <div 
                                key={index} 
                                onClick={() => handleDateClick(day)}
                                className={`${baseClasses} ${isPast ? disabledClasses : activeClasses}`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Time Slots */}
            <div className="flex-grow overflow-y-auto mt-4 pt-4 border-t border-gray-200">
                {selectedDate && (
                    <div>
                        <h4 className="font-semibold text-center mb-3 text-dark text-sm sm:text-base">Available Slots for {selectedDate.toLocaleDateString()}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                            {timeSlots.map(time => {
                                const isSelected = selectedTime === time;
                                const slotClasses = `py-2.5 px-2 text-center rounded-lg border-2 transition-colors cursor-pointer text-sm font-medium ${isSelected ? 'bg-secondary text-white border-secondary shadow-md' : 'bg-white border-gray-300 hover:border-secondary'}`;
                                return (
                                    <div key={time} onClick={() => setSelectedTime(time)} className={slotClasses}>
                                        {time}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0 mt-auto pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200">
                <button onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold">Cancel</button>
                <button 
                    onClick={handleConfirm}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white bg-primary hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default CalendarPicker;
