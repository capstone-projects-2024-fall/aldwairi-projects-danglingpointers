import unittest
from HtmlTestRunner import HTMLTestRunner
import sys
import os
import time
from datetime import datetime
import io

# Import all test classes
from GameTest import GameTest
from UpdateTest import UpdateTest
from UserAccountTest import UserAccountTest

def run_test_suite():
    start_time = time.time()
    test_suite = unittest.TestSuite()
    
    test_classes = [GameTest, UpdateTest, UserAccountTest]
    for test_class in test_classes:
        test_suite.addTests(unittest.TestLoader().loadTestsFromTestCase(test_class))

    output_dir = os.path.join(os.path.dirname(__file__), 'test_reports')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    report_file = os.path.join(output_dir, f'test_report_{timestamp}.html')

    try:
        # Create StringIO for template handling
        output = io.StringIO()
        runner = HTMLTestRunner(
            stream=output,
            report_title="Dangling Pointers Test Report",
            descriptions="Test Results",
            template="""
                <html>
                    <head>
                        <title>%(title)s</title>
                        <meta charset="utf-8">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                max-width: 1200px;
                                margin: 20px auto;
                                padding: 20px;
                                background: #f5f5f5;
                            }
                            h1 {
                                color: #2c3e50;
                                text-align: center;
                                padding: 20px;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            }
                            .status-pass:before { content: "[PASS] "; color: #27ae60; }
                            .status-fail:before { content: "[FAIL] "; color: #e74c3c; }
                            .status-error:before { content: "[ERROR] "; color: #c0392b; }
                            .status-skip:before { content: "[SKIP] "; color: #f39c12; }
                            .test-result {
                                background: white;
                                padding: 15px;
                                margin: 10px 0;
                                border-radius: 8px;
                                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            }
                            .summary { 
                                background: white;
                                padding: 20px;
                                margin: 20px 0;
                                border-radius: 8px;
                                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            }
                        </style>
                    </head>
                    <body>
                        <h1>%(title)s</h1>
                        <div class="summary">%(heading)s</div>
                        <div class="results">%(report)s</div>
                    </body>
                </html>
            """
        )
        result = runner.run(test_suite)
        
        # Convert to bytes and write
        with open(report_file, 'wb') as f:
            f.write(output.getvalue().encode('utf-8'))
        
        duration = time.time() - start_time
        passed = result.testsRun - len(result.failures) - len(result.errors) - len(result.skipped)
        
        print("\nTest Summary:")
        print(f"Tests Run: {result.testsRun}")
        print(f"Passed: {passed}")
        print(f"Failed: {len(result.failures)}")
        print(f"Errors: {len(result.errors)}")
        print(f"Skipped: {len(result.skipped)}")
        print(f"Duration: {duration:.2f}s")
        print(f"\nReport saved to: {report_file}")

        return result.wasSuccessful()
    except Exception as e:
        print(f"Error generating test report: {str(e)}")
        return False

if __name__ == '__main__':
    success = run_test_suite()
    sys.exit(0 if success else 1)