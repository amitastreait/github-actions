/**
 * Copyright (c), FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
**/
public interface fflib_IDomainFactory {
	fflib_IDomain newInstance(Set<Id> recordIds);
	fflib_IDomain newInstance(List<SObject> records);
	fflib_IDomain newInstance(List<Object> objects, Object objectType);
	fflib_IDomain newInstance(List<SObject> records, SObjectType domainSObjectType);
}
