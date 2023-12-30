/**
 * Copyright (c), FinancialForce.com, inc
 * All rights reserved.

**/
public interface fflib_IDomainFactory {
	fflib_IDomain newInstance(Set<Id> recordIds);
	fflib_IDomain newInstance(List<SObject> records);
	fflib_IDomain newInstance(List<Object> objects, Object objectType);
	fflib_IDomain newInstance(List<SObject> records, SObjectType domainSObjectType);
}
