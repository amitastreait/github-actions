@IsTest
public with sharing class MyClassTest {
    
    @IsTest
    private static void nameSpaceTest(){
        Test.startTest();
        MyClass.nameSpace();
        Test.stopTest();
    }
}