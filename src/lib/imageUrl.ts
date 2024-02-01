export default function imageUrl(imageId: string) {
  return `https://rymmmspllbfdqosgmyzt.supabase.co/storage/v1/object/public/${process.env.NEXT_PUBLIC_IMAGE_BUCKET}/${imageId}`;
}
