/**
 * Copyright (c), FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the FinancialForce.com, inc nor the names of its contributors
 *      may be used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
**/
public interface fflib_IDomainFactory {
	fflib_IDomain newInstance(Set<Id> recordIds);
	fflib_IDomain newInstance(List<SObject> records);
	fflib_IDomain newInstance(List<Object> objects, Object objectType);
	fflib_IDomain newInstance(List<SObject> records, SObjectType domainSObjectType);
}
