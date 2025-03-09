import type {Message} from "@/app/components/ChatContainer";
import { BookingItem } from "./BookingItem";

interface BookingContainerProps {
		messages: Message[];
}

export const BookingContainer: React.FC<BookingContainerProps> = ({
																																																																				messages
																																																																		}) => {
		return (
				<div className="flex flex-col w-full gap-2 p-4 bg-white shadow-sm rounded-2xl border border-gray-100">
						{messages.filter(l => l.message?.type === 'hotel').map((message, index) => (
								<BookingItem
										key={index}
										title={`🏨 ${message.message?.hotel?.name}` || ''}
										bookingUrl={message.message?.hotel?.href}
										isBooked={false}
								/>
						))}
						{messages.filter(l => l.message?.type === 'activities').map((message, index) => (
								message.message?.activities?.map((activity, index) => (
										<BookingItem
												key={index}
												title={`🏔️ ${activity.name}`}
												bookingUrl={activity.href}
												isBooked={false}
										/>
								))
						))}
				</div>
		);
};
