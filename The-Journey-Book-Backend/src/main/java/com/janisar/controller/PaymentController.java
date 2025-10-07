package com.janisar.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SignatureException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private static final String RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_ID";
    private static final String RAZORPAY_KEY_SECRET = "YOUR_SECRET_KEY";
    private static final String WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET";

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();

        try {
            int amount = (int) data.get("amount");
            String currency = (String) data.get("currency");
            String receipt = (String) data.get("receipt");

            RazorpayClient razorpay = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", 1);

            Order order = razorpay.orders.create(orderRequest);

            response.put("success", true);
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));

        } catch (RazorpayException e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Internal server error");
        }

        return response;
    }

    @PostMapping("/verify-payment")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();

        try {
            String razorpayOrderId = (String) data.get("razorpay_order_id");
            String razorpayPaymentId = (String) data.get("razorpay_payment_id");
            String razorpaySignature = (String) data.get("razorpay_signature");

            String generatedSignature = generateSignature(razorpayOrderId + "|" + razorpayPaymentId, RAZORPAY_KEY_SECRET);

            if (generatedSignature.equals(razorpaySignature)) {
                response.put("success", true);
                response.put("message", "Payment verified successfully");
                response.put("paymentId", razorpayPaymentId);
            } else {
                response.put("success", false);
                response.put("error", "Payment verification failed");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Verification error");
        }

        return response;
    }

    private String generateSignature(String data, String secret) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes());
        return bytesToHex(hash);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}