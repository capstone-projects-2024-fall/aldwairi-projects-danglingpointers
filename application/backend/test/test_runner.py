
import unittest
from HtmlTestRunner import HTMLTestRunner
import sys
import os
from datetime import datetime

# Import all test classes
from GameTest import GameTest
from UpdateTest import UpdateTest
from UserAccountTest import UserAccountTest


def run_test_suite():
    # Create test suite
    test_suite = unittest.TestSuite()
    
    # Add test cases
    test_suite.addTests(unittest.TestLoader().loadTestsFromTestCase(GameTest))
    test_suite.addTests(unittest.TestLoader().loadTestsFromTestCase(UpdateTest))
    test_suite.addTests(unittest.TestLoader().loadTestsFromTestCase(UserAccountTest))

    # Create output directory if it doesn't exist
    output_dir = os.path.join(os.path.dirname(__file__), 'test_reports')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Generate timestamp for unique report name
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    report_file = os.path.join(output_dir, f'test_report_{timestamp}.html')

    # Run tests with HTMLTestRunner
    with open(report_file, 'w') as f:
        runner = HTMLTestRunner(
            stream=f,
            report_title="Dangling Pointers Test Report",
            descriptions="Test Results for Capstone Project",
            combine_reports=True,
            add_timestamp=True
        )
        result = runner.run(test_suite)
        
        # Also print summary to console
        print("\nTest Summary:")
        print(f"Tests Run: {result.testsRun}")
        print(f"Failures: {len(result.failures)}")
        print(f"Errors: {len(result.errors)}")
        print(f"Skipped: {len(result.skipped)}")
        print(f"\nDetailed report saved to: {report_file}")

        return result.wasSuccessful()

if __name__ == '__main__':
    success = run_test_suite()
    sys.exit(0 if success else 1)