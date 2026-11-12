"""
Unit and Integration Test Suite for AgriCycle AI Microservice
Synchronous direct endpoint and heuristic testing.
Author: Samarth (Member 4 - AI + Images + Testing)
"""

import io
import os
import unittest
from PIL import Image
from fastapi import HTTPException, UploadFile
from main import (
    health_check,
    chat_with_advisor,
    verify_crop_image,
    verify_image_by_path,
    analyze_image_heuristics,
    ChatRequest,
    VerifyPathRequest,
)

class TestAIService(unittest.TestCase):
    def test_health_check(self):
        """Verify health check returns valid JSON status"""
        result = health_check()
        self.assertEqual(result["status"], "ok")
        self.assertIn("service", result)
        self.assertEqual(result["version"], "1.0.0")

    def test_chat_valid_query(self):
        """Verify conversational advisory returns comprehensive circular economy recommendations"""
        req = ChatRequest(
            message="What can I do with surplus paddy straw?",
            user_role="generator",
            crop_context="Paddy Straw",
        )
        response = chat_with_advisor(req)
        self.assertTrue(response.success)
        self.assertIn("Mushroom", response.reply)
        self.assertTrue(len(response.suggestions) > 0)
        self.assertIn("disclaimer", response.model_dump())

    def test_chat_areca_query(self):
        """Verify conversational advisory returns areca leaf tableware guidance"""
        req = ChatRequest(
            message="Can I make plates from areca leaves?",
            user_role="generator",
            crop_context="Areca Leaf",
        )
        response = chat_with_advisor(req)
        self.assertTrue(response.success)
        self.assertIn("Areca", response.reply)
        self.assertTrue(len(response.suggestions) > 0)

    def test_chat_pricing_query(self):
        """Verify pricing advisory gives realistic Karnataka rates"""
        req = ChatRequest(
            message="What are the current market prices and rates across South India?",
            user_role="utilizer",
        )
        response = chat_with_advisor(req)
        self.assertTrue(response.success)
        self.assertIn("Price Guide", response.reply)

    def test_chat_empty_message(self):
        """Verify that empty message raises HTTPException 400"""
        req = ChatRequest(message="   ")
        with self.assertRaises(HTTPException) as ctx:
            chat_with_advisor(req)
        self.assertEqual(ctx.exception.status_code, 400)

    def test_heuristic_analysis_paddy_straw(self):
        """Verify computer-vision heuristic identifies golden-yellow color as Paddy Straw and assesses Grade A"""
        img = Image.new("RGB", (100, 100), color=(210, 180, 50))
        analysis = analyze_image_heuristics(img)
        self.assertEqual(analysis["crop_detected"], "Paddy Straw")
        self.assertTrue(analysis["is_verified"])
        self.assertIn(analysis["quality_grade"], ["Grade A (High)", "Grade B (Medium)"])
        self.assertTrue(0 <= analysis["moisture_percentage"] <= 100)
        self.assertTrue(0 <= analysis["confidence_score"] <= 1.0)

    def test_heuristic_analysis_coconut_husk(self):
        """Verify computer-vision heuristic identifies reddish-brown as Coconut Husk"""
        img = Image.new("RGB", (100, 100), color=(140, 60, 30))
        analysis = analyze_image_heuristics(img)
        self.assertEqual(analysis["crop_detected"], "Coconut Husk")

    def test_heuristic_analysis_areca_leaf(self):
        """Verify computer-vision heuristic identifies greenish tones as Areca Leaf"""
        img = Image.new("RGB", (100, 100), color=(60, 160, 40))
        analysis = analyze_image_heuristics(img)
        self.assertEqual(analysis["crop_detected"], "Areca Leaf")

    def test_verify_image_endpoint_valid(self):
        """Verify FastAPI endpoint accepts valid image file and returns verified result"""
        img = Image.new("RGB", (120, 120), color=(220, 190, 60))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        raw_bytes = buf.getvalue()

        upload_file = UploadFile(
            file=io.BytesIO(raw_bytes),
            filename="test_straw.jpg",
            headers={"content-type": "image/jpeg"},
        )

        res = verify_crop_image(upload_file)
        self.assertTrue(res.success)
        self.assertTrue(res.verified)
        self.assertEqual(res.verified_by, "AI_CNN")
        self.assertIn("quality_grade", res.model_dump())
        self.assertIn("moisture_percentage", res.model_dump())

    def test_verify_image_endpoint_unsupported_format(self):
        """Verify FastAPI endpoint rejects unsupported content-type"""
        fake_file = UploadFile(
            file=io.BytesIO(b"fake data"),
            filename="document.pdf",
            headers={"content-type": "application/pdf"},
        )
        with self.assertRaises(HTTPException) as ctx:
            verify_crop_image(fake_file)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Unsupported file format", ctx.exception.detail)

    def test_verify_image_endpoint_oversized_file(self):
        """Verify FastAPI endpoint rejects files exceeding 10MB"""
        oversized = UploadFile(
            file=io.BytesIO(b"0" * (11 * 1024 * 1024)),
            filename="huge.jpg",
            headers={"content-type": "image/jpeg"},
        )
        with self.assertRaises(HTTPException) as ctx:
            verify_crop_image(oversized)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("exceeds maximum 10MB", ctx.exception.detail)

    def test_verify_path_endpoint(self):
        """Verify verifying image via local file path"""
        temp_path = os.path.join(os.path.dirname(__file__), "temp_test_crop.jpg")
        img = Image.new("RGB", (100, 100), color=(200, 180, 50))
        img.save(temp_path, format="JPEG")
        try:
            req = VerifyPathRequest(image_path=temp_path)
            res = verify_image_by_path(req)
            self.assertTrue(res.success)
            self.assertEqual(res.crop_detected, "Paddy Straw")
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)


if __name__ == "__main__":
    unittest.main()
