/**
 * Utility to load Razorpay checkout script and initiate real-time payment.
 */

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function processRazorpayPayment({
  amount,
  serviceName,
  userName,
  userEmail,
  userPhone,
  onSuccess,
  onError,
}: {
  amount: number;
  serviceName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  onSuccess: (result: RazorpayPaymentResult) => void;
  onError: (errorMsg: string) => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onError("Unable to load Razorpay payment gateway. Please check your internet connection.");
    return;
  }

  // 1. Create order on server
  let orderData;
  try {
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, serviceName }),
    });
    orderData = await res.json();
    if (!res.ok) {
      onError(orderData.message || orderData.error || "Failed to initialize payment order.");
      return;
    }
  } catch (err: unknown) {
    onError(err instanceof Error ? err.message : "Network error while connecting to Razorpay.");
    return;
  }

  // 2. Open Razorpay modal
  const RazorpayConstructor = (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
  if (!RazorpayConstructor) {
    onError("Razorpay SDK could not be initialized.");
    return;
  }

  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency || "INR",
    name: "Shastriya Yogshala",
    description: serviceName || "Astrology Consultation",
    image: "/astro-bodh-logo.png",
    order_id: orderData.orderId,
    prefill: {
      name: userName || "",
      email: userEmail || "",
      contact: userPhone || "",
    },
    theme: {
      color: "#c9a227",
    },
    handler: async function (response: RazorpayPaymentResult) {
      // 3. Verify signature on server
      try {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.verified) {
          onSuccess(response);
        } else {
          onError(verifyData.error || "Payment verification failed.");
        }
      } catch (err: unknown) {
        onError(err instanceof Error ? err.message : "Payment verification failed.");
      }
    },
    modal: {
      ondismiss: function () {
        onError("Payment window was cancelled.");
      },
    },
  };

  const paymentObject = new RazorpayConstructor(options);
  paymentObject.open();
}
