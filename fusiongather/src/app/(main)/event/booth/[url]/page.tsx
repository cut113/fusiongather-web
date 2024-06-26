import BackgroupImage from "@/components/layout/BackgroupImage";
import { Metadata } from "next";
import { getBoothById, isBoothAuthor } from "@/lib/actions/booth";
import BoothDetailPage from "@/app/(main)/event/booth/[url]/component/BoothDetail";
import { getImagesByBoothId } from "@/lib/actions/image";
import boothErrorImage from '../../public/test-booth.jpg'
import { useRouter } from "next/navigation";
import NotFoundPage from "@/components/shared/NotFoundPage";

interface Props {
    params: {
        url: number
    }
}

export async function generateMetadata({ params: { url } }: Props): Promise<Metadata> {
    try {
        let booth = url
        if (!booth) {
            return {
                title: "Not Found",
                description: "The page you are looking for does not exist."
            }
        }
        return {
            title: String(url),
            description: String(url)
        }
    } catch (error: any) {
        return {
            title: "Not Found",
            description: "The page you are looking for does not exist."
        }
    }
}




export default async function BoothDetail({ params: { url } }: Props) {
    const booth = await getBoothById(url)
    if (booth?.message) {
        return (
            <NotFoundPage />
        )
    }
    const boothImage = await getImagesByBoothId(url)
    const isBoothOwner = await isBoothAuthor(booth.vendorId.id)

    return (
        <main className="mt-[90px] min-h-screen">
            {boothImage.length !==0 ? <BackgroupImage src={boothImage[0]?.url} page="detail" />
            : <BackgroupImage src="https://utfs.io/f/e9e6f4d9-b367-4c7f-925b-57fd1839b6cb-lcto2t.jpg" page="detail" />} 
            {/* //thay url này thành 1 url của ảnh lỗi */}
            <BoothDetailPage booth={booth} isOwner={isBoothOwner}/>
        </main>
    )
}