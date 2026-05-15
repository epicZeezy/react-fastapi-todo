import CheckoutConfirmation from "@/components/CheckoutConfirmation";

type CheckoutOrderPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function CheckoutOrderPage({
  params,
}: CheckoutOrderPageProps) {
  const { orderId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
      <CheckoutConfirmation orderId={orderId} />
    </main>
  );
}
