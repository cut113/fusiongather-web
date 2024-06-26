/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { LuHeart, LuMapPin } from "react-icons/lu";
import { FaHeart } from "react-icons/fa6";
import Link from "next/link";
import { useState, useEffect } from "react";
import { checkIsEventOwner, checkIsFollowed, followEvent, unFollowEvent } from "@/lib/actions/event";
import { getImagesByEventId } from "@/lib/actions/image";
import { useRouter } from "next/navigation";
import { formatTime } from "@/lib/Format";
import EventItemSkeleton from "./EventItemSkeleton";
import { set } from "zod";
import toast from "react-hot-toast";

const EventItem = ({ event }: any) => {
    const [isFollowed, setIsFollowed] = useState(false);
    const [eventImage, setEventImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const owner = await checkIsEventOwner(event?.author?.id);
                setIsOwner(owner);
                const isFollowed = await checkIsFollowed(event?.id);
                if (isFollowed === null) {
                    setIsFollowed(false);
                }
                setIsFollowed(isFollowed);
                const image = await getImagesByEventId(event?.id);
                if (image) {
                    setLoading(!loading)
                }
                setEventImage(image[0]?.url);
            } catch (error) {
                console.error("Error fetching follower count:", error);
            }
        };
        router.refresh();
        fetchData();
    }, [event?.id]);

    const handleFollowEvent = async () => {
        if (isOwner) {
            toast.error("You can't follow your own event");
        } else {
        try {
            if (isFollowed) {
                await unFollowEvent(event.id);
                setIsFollowed(false);
            } 
            else if (isFollowed === null) {
                router.push("/login");
            }             
            else {
                await followEvent(event.id);
                setIsFollowed(true);
            }
        } catch (error) {
            console.error("Error toggling follow status:", error);
        }
    }
    }


    return (
        <>
            {loading ?
                <EventItemSkeleton />
                :
                <div className="col-span-1 cursor-pointer border-[1px] border-slate-200 bg-slate-50 rounded-xl shadow-sm text-sm hover:shadow-xl transition-all duration-200">
                    <div className="w-full">
                        <div className="overflow-hidden rounded-xl relative aspect-[2/1]">
                            <Image
                                src={eventImage ? eventImage : '/no-image.png'}
                                alt={`event-image`}
                                fill
                                loading="lazy"
                                className="w-full h-full object-fill z-20"
                            />
                        </div>
                        <div className="pt-2 pb-3 px-6 flex flex-col justify-between">
                            <Link href={`/event/${event?.id}`}>
                                <div>
                                    <div className="h-14 truncate-2-line">
                                        <div className="text-xl ">
                                            {event?.title}
                                        </div>
                                    </div>
                                    <div className="py-3 text-xs w-full max-w-[190px]">
                                        <div className="truncate text-secondary pb-1">
                                            {event?.author?.firstName} {event?.author?.lastName}
                                        </div>
                                        <div className="flex flex-col gap-1 text-gray-700">
                                            <div>
                                                From {formatTime(event?.startDateTime)}
                                            </div>
                                            <div>
                                                To {formatTime(event?.endDateTime)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-10 flex items-center gap-3">
                                        <LuMapPin size="17" />
                                        <div className="text-secondary  truncate-2-line">
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="flex items-center border-t border-gray-300 justify-between pt-4 pb-2 mt-2">
                                {
                                    event.isFree ? <span>Free</span> : <span>{event.price} vnd</span>
                                }
                                <div className=" hover:scale-125 transition-all duration-200" onClick={handleFollowEvent}>
                                    <div className="p-1">
                                        {isFollowed ? <FaHeart color="#FF3030" size="20" /> : <LuHeart size="20" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default EventItem;