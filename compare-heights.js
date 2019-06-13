// types
const { ApiPromise } = require('@polkadot/api');
const util = require('util');
const request = require("request");
const requestPromise = util.promisify(request);

//Import typeReg-istry
const getTypeRegistry = require('@polkadot/types/codec/typeRegistry').default;

const { Enum, EnumType, Struct, Option, Vector } = require ('@polkadot/types/codec');

// const { getTypeRegistry, u32, u64, Bool, Text, BlockNumber, Moment, AccountId, Hash, Balance, Bytes } = require ('@polkadot/types');
const { u32, u64, Bool, Text, BlockNumber, Moment, AccountId, Hash, Balance, Bytes } = require ('@polkadot/types');
const { u8aToString } = require('@polkadot/util');


// media-types
class DataObjectTypeId extends u64 {};
class DataObjectStorageRelationshipId extends u64 {};
class ContentId extends Hash {};
class SchemaId extends u64 {};
class DownloadSessionId extends u64 {};
class BlockAndTime extends Struct {
  constructor(value) {
    super({
      block: _types.BlockNumber,
      time: _types.Moment
    }, value);
  }}
//class ContentVisibility extends Enum {};

class ContentVisibility extends Enum {
  constructor(value) {
    super(['Draft', 'Public'], value);
  }
}

//class ContentMetadata extends Struct {};
class ContentMetadata extends Struct {
  constructor(value) {
    super({
      owner: _types.AccountId,
      added_at: BlockAndTime,
      children_ids: VecContentId,
      visibility: ContentVisibility,
      schema: SchemaId,
      json: _types.Text
    }, value);
  }}

//class ContentMetadataUpdate extends Struct {};
class ContentMetadataUpdate extends Struct {
  constructor(value) {
    super({
      children_ids: OptionVecContentId,
      visibility: OptionContentVisibility,
      schema: OptionSchemaId,
      json: _types2.OptionText
    }, value);
  }
}

//class LiaisonJudgement extends Enum {};
class LiaisonJudgement extends Enum {
  constructor(value) {
    super(['Pending', 'Accepted', 'Rejected'], value);
  }
}
//class DataObject extends Struct {};
class DataObject extends Struct {
  constructor(value) {
    super({
      owner: _types.AccountId,
      added_at: BlockAndTime,
      type_id: DataObjectTypeId,
      size: _types.u64,
      liaison: _types.AccountId,
      liaison_judgement: LiaisonJudgement
    }, value);
  }
} 

//class DataObjectStorageRelationship extends Struct {};
class DataObjectStorageRelationship extends Struct {
  constructor(value) {
    super({
      content_id: ContentId,
      storage_provider: _types.AccountId,
      ready: _types.Bool
    }, value);
  }
}

//class DataObjectType extends Struct {};
class DataObjectType extends Struct {
  constructor(value) {
    super({
      description: _types.Text,
      active: _types.Bool
    }, value);
  }
}
//class DownloadState extends Enum {};
class DownloadState extends Enum {
  constructor(value) {
    super(['Started', 'Ended'], value);
  }
}
//class DownloadSession extends Struct {};
class DownloadSession extends Struct {
  constructor(value) {
    super({
      content_id: ContentId,
      consumer: _types.AccountId,
      distributor: _types.AccountId,
      initiated_at_block: _types.BlockNumber,
      initiated_at_time: _types.Moment,
      state: DownloadState,
      transmitted_bytes: _types.u64
    }, value);
  }
}

  getTypeRegistry().register({
      '::ContentId': ContentId,
      '::DataObjectTypeId': DataObjectTypeId,
      SchemaId,
      ContentId,
      ContentVisibility,
      ContentMetadata,
      ContentMetadataUpdate,
      LiaisonJudgement,
      DataObject,
      DataObjectStorageRelationshipId,
      DataObjectStorageRelationship,
      DataObjectTypeId,
      DataObjectType,
      DownloadState,
      DownloadSessionId,
      DownloadSession
  });

// member-types
class MemberId extends u64 {};
class PaidTermId extends u64 {};
class SubscriptionId extends u64 {};
class Paid extends PaidTermId {};
class Screening extends AccountId {};
//class EntryMethod extends EnumType {};
class EntryMethod extends EnumType {
  constructor(value, index) {
    super({
      Paid,
      Screening
    }, value, index);
  }
}

//class UserInfo extends Struct {};
class UserInfo extends Struct {
  constructor(value) {
    super({
      handle: _types2.OptionText,
      avatar_uri: _types2.OptionText,
      about: _types2.OptionText
    }, value);
  }
}
//class PaidMembershipTerms extends Struct {};
class PaidMembershipTerms extends Struct {
  constructor(value) {
    super({
      id: PaidTermId,
      fee: _types.BalanceOf,
      text: _types.Text
    }, value);
  }
}



    getTypeRegistry().register({
      Paid,
      Screening,
      EntryMethod
    });
    getTypeRegistry().register({
      MemberId,
      PaidTermId,
      SubscriptionId,
      Profile: {
        id: 'MemberId',
        handle: 'Text',
        avatar_uri: 'Text',
        about: 'Text',
        registered_at_block: 'BlockNumber',
        registered_at_time: 'Moment',
        entry: 'EntryMethod',
        suspended: 'Bool',
        subscription: 'Option<SubscriptionId>'
      },
      UserInfo,
      CheckedUserInfo: {
        handle: 'Text',
        avatar_uri: 'Text',
        about: 'Text'
      },
      PaidMembershipTerms: {
        id: 'PaidTermId',
        fee: 'BalanceOf',
        text: 'Text'
      }
    });


//roles-types
//class Role extends Enum {};
class Role extends Enum {
  constructor(value) {
    super(['Storage'], value);
  }}

//class RoleParameters extends Struct {};
class RoleParameters extends Struct {
  constructor(value) {
    super({
      min_stake: _types.Balance,
      min_actors: _types.u32,
      max_actors: _types.u32,
      reward: _types.Balance,
      reward_period: _types.BlockNumber,
      bonding_period: _types.BlockNumber,
      unbonding_period: _types.BlockNumber,
      min_service_period: _types.BlockNumber,
      startup_grace_period: _types.BlockNumber,
      entry_request_fee: _types.Balance
    }, value);
  }
}

//class Actor extends Struct {};
class Actor extends Struct {
  constructor(value) {
    super({
      member_id: MemberId,
      role: Role,
      account: AccountId,
      joined_at: BlockNumber
    }, value);
  }
}



getTypeRegistry().register({
      Role,
      RoleParameters,
      Request: '(AccountId, MemberId, Role, BlockNumber)',
      Requests: 'Vec<Request>',
      Actor
    });



//utils-types
/*
class OptionText extends _codec.Option.with(_types.Text) {
  static none() {
    return new _codec.Option(_types.Text, null);
  }
}
*/
class ProposalStatus extends Enum {};
class VoteKind extends Enum {};
class Amount extends Balance {};
class Announcing extends BlockNumber {};
class Voting extends BlockNumber {};
class Revealing extends BlockNumber {};
//class ElectionStage extends EnumType {};
class ElectionStage extends EnumType {
  constructor(value, index) {
    super({
      Announcing,
      Voting,
      Revealing
    }, value, index);
  }
}

getTypeRegistry().register({
  Announcing,
  Voting,
  Revealing,
  ElectionStage
});
getTypeRegistry().register({
  Amount,
});
getTypeRegistry().register({
  ProposalStatus,
  VoteKind
});

getTypeRegistry().register({
  'Stake': {
    'new': 'Balance',
    'transferred': 'Balance'
  },
  'Backer': {
    member: 'AccountId',
    stake: 'Balance'
  },
  'Seat': {
    member: 'AccountId',
    stake: 'Balance',
    backers: 'Vec<Backer>'
  },
  'Seats': 'Vec<Seat>',
  'SealedVote': {
    'voter': 'AccountId',
    'commitment': 'Hash',
    'stake': 'Stake',
    'vote': 'Option<AccountId>'
  },
  'TransferableStake': {
    'seat': 'Balance',
    'backing': 'Balance'
  },
  'RuntimeUpgradeProposal': {
    'id': 'u32',
    'proposer': 'AccountId',
    'stake': 'Balance',
    'name': 'Text',
    'description': 'Text',
    'wasm_hash': 'Hash',
    'proposed_at': 'BlockNumber',
    'status': 'ProposalStatus'
  },
  'TallyResult': {
    'proposal_id': 'u32',
    'abstentions': 'u32',
    'approvals': 'u32',
    'rejections': 'u32',
    'slashes': 'u32',
    'status': 'ProposalStatus',
    'finalized_at': 'BlockNumber'
  }
});


//const telemetryHeight = process.argv[2];

//console.log(telemetryHeight)

async function main () {
    const api = await ApiPromise.create();
    const hash = await api.rpc.chain.getFinalizedHead();
    var header = await api.derive.chain.getHeader(`${hash}`);
    console.log(`${header.blockNumber}`)
}


main().catch(console.error).finally(_ => process.exit());