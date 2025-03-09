import type {Message} from "@/app/components/ChatContainer";
import { BookingItem } from "./BookingItem";
import { useState } from "react";

interface BookingContainerProps {
		messages: Message[];
}

export const BookingContainer: React.FC<BookingContainerProps> = ({
																																																																				messages
																																																																		}) => {
		const [bookedCount, setBookedCount] = useState(0);
		// Asumimos que siempre hay un vuelo
		const totalBookings = 1 + messages.filter(l => l.message?.type === 'hotel').length + messages.filter(l => l.message?.type === 'activities').reduce((acc, l) => acc + (l.message?.activities?.length || 0), 0);
		console.log(bookedCount);
		console.log(totalBookings);

		return (
			<>
				<div className="flex flex-col w-full gap-2 p-4 bg-white shadow-sm rounded-2xl border border-gray-100">
						<h3 className="text-lg font-medium text-gray-900">💳 ¡Vamos a reservar!</h3>
						{/*{messages.filter(l => l.message?.type === 'flight').map((message, index) => (*/}
						{/*		<BookingItem*/}
						{/*				key={index}*/}
						{/*				title={`✈️ ${message.message?.hotel?.name}` || ''}*/}
						{/*				bookingUrl={message.message?.hotel?.href}*/}
						{/*				onBooked={() => setBookedCount(bookedCount + 1)}*/}
						{/*		/>*/}
						{/*))}*/}
						{messages.filter(l => l.message?.type === 'hotel').map((message, index) => (
								<BookingItem
										key={index}
										title={`🏨 ${message.message?.hotel?.name}` || ''}
										bookingUrl={message.message?.hotel?.href}
										onBooked={() => setBookedCount(bookedCount + 1)}
								/>
						))}
						{messages.filter(l => l.message?.type === 'activities').map((message, index) => (
								message.message?.activities?.map((activity, index) => (
										<BookingItem
												key={index}
												title={`🏔️ ${activity.name}`}
												bookingUrl={activity.href}
												onBooked={() => setBookedCount(bookedCount + 1)}
										/>
								))
						))}

				</div>
					{bookedCount >= totalBookings && (
							<div className="flex flex-col w-full gap-2 p-4 bg-white shadow-sm rounded-2xl border border-gray-100 mt-4">
								<h3 className="text-lg text-center font-medium text-gray-900">💫 ¡Todo listo, no te olvidés el cepillo de dientes! 🪥</h3>
							</div>
					)}
			</>
		);
};
