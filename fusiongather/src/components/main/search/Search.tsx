"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import BackDrop from "./BackDrop";
import BodyOptionsSearch from "./BodyOptionSearch";
import { ListEvent } from "@/contants";

interface Props {
    onClose?: () => void
}

const Search = ({ onClose }: Props) => {
    const router = useRouter()
    const [searchString, setSearchString] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const { register, handleSubmit, watch } = useForm<FieldValues>({
        defaultValues: {
            searchValues: ""
        }
    })

    const searchValues = watch('searchValues');

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (searchString !== "") {
            router.push(`/search?keyword=${searchString}`)
        }
        setIsOpen(false)
        //close toggle mobile
        if (onClose) {
            onClose();
        }
    }
    useEffect(() => {
        setSearchString(searchValues)
        setIsOpen(true)
        if (searchValues.length < 2) {
            setIsOpen(false)
        }
    }, [searchValues]);


    return (
        <div className="relative">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-secondary hidden sm:flex items-center gap-2 pl-3 pr-1  py-2 rounded-full">
                <IoSearch size="20" />
                <input
                    placeholder="What event are you looking for?"
                    {...register("searchValues", { required: true })}
                    className="xl:min-w-[300px] lg:min-w-[215px] sm:min-w-[210px] min-w-[250px] px-1 bg-secondary rounded-full outline-none text-sm text-secondary" />
            </form>
            {
                isOpen &&
                <>
                    <div className="w-[175%] top-12 right-0 md:translate-x-1/4 md:right-8 min-w-full absolute p-4 max-h-[400px] overflow-y-auto bg-white shadow-md z-50 rounded-md">
                        <BodyOptionsSearch
                            searchString={searchString.length > 0 ? searchString : null}
                            data={ListEvent!}
                            onClose={() => setIsOpen(false)}
                            setSearchString={() => setSearchString("")}
                            onCloseToggle={onClose}
                        />
                    </div>
                    <BackDrop onClick={() => setIsOpen(false)} />
                </>
            }
        </div>
    );
}

export default Search;