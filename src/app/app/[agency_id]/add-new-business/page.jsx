"use client"
import AddNewBusiness from "@/app/(components)/add-new-business/AddNewBusiness";
import { useParams } from "next/navigation";
export default function AddBusinessPage() {
  const { agency_id } = useParams()
  console.log("Params Data", agency_id)


  return <AddNewBusiness targetRoute={`/app/${agency_id}/plans`} />;
}
