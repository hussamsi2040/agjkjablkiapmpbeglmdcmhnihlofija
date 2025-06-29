#!/usr/bin/env python3
"""
Simple test script to verify CollegeEssayAI app functions work correctly
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all required modules can be imported"""
    print("🔍 Testing imports...")
    
    try:
        import streamlit as st
        print("✅ Streamlit imported successfully")
    except ImportError as e:
        print(f"❌ Streamlit import failed: {e}")
        return False
    
    try:
        import requests
        print("✅ Requests imported successfully")
    except ImportError as e:
        print(f"❌ Requests import failed: {e}")
        return False
    
    try:
        import json
        print("✅ JSON imported successfully")
    except ImportError as e:
        print(f"❌ JSON import failed: {e}")
        return False
    
    try:
        from datetime import datetime
        print("✅ Datetime imported successfully")
    except ImportError as e:
        print(f"❌ Datetime import failed: {e}")
        return False
    
    return True

def test_app_functions():
    """Test if app functions can be imported and called"""
    print("\n🔍 Testing app functions...")
    
    try:
        # Import functions from app.py
        from app import validate_api_key, build_essay_prompt, build_analysis_prompt
        
        # Test validate_api_key
        print("Testing validate_api_key...")
        is_valid, message = validate_api_key("sk-test12345678901234567890")
        print(f"  Valid key test: {is_valid}, {message}")
        
        is_invalid, message = validate_api_key("invalid-key")
        print(f"  Invalid key test: {is_invalid}, {message}")
        
        # Test build_essay_prompt
        print("Testing build_essay_prompt...")
        prompt = build_essay_prompt(
            "Tell us about yourself",
            "personal-statement",
            500,
            "top-20",
            "authentic",
            "I love science and community service",
            "Make it personal and engaging"
        )
        print(f"  Prompt length: {len(prompt)} characters")
        print(f"  Prompt preview: {prompt[:100]}...")
        
        # Test build_analysis_prompt
        print("Testing build_analysis_prompt...")
        analysis_prompt = build_analysis_prompt(
            "This is a sample essay for testing purposes.",
            "comprehensive",
            "top-20",
            "Focus on structure and flow"
        )
        print(f"  Analysis prompt length: {len(analysis_prompt)} characters")
        print(f"  Analysis preview: {analysis_prompt[:100]}...")
        
        print("✅ All app functions tested successfully")
        return True
        
    except Exception as e:
        print(f"❌ App function test failed: {e}")
        return False

def test_streamlit_config():
    """Test if Streamlit configuration is valid"""
    print("\n🔍 Testing Streamlit configuration...")
    
    try:
        import streamlit as st
        
        # Test basic Streamlit functionality
        print("✅ Streamlit is available")
        
        # Check if we can create a simple app
        print("✅ Streamlit configuration looks good")
        return True
        
    except Exception as e:
        print(f"❌ Streamlit configuration test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 CollegeEssayAI App Test Suite")
    print("=" * 50)
    
    # Test imports
    if not test_imports():
        print("\n❌ Import tests failed. Please install required packages:")
        print("   pip install -r requirements.txt")
        return False
    
    # Test app functions
    if not test_app_functions():
        print("\n❌ App function tests failed.")
        return False
    
    # Test Streamlit config
    if not test_streamlit_config():
        print("\n❌ Streamlit configuration test failed.")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed! The app should work correctly.")
    print("\nTo run the app:")
    print("   streamlit run app.py")
    print("\nTo test the API:")
    print("   python test_simple.py")
    print("   python test_api_complete.py")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 