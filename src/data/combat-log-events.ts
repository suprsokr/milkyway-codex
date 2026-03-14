import type { CombatLogSubEvent, CombatLogArgument } from '../types/api.types.ts'

const STANDARD_ARGS: CombatLogArgument[] = [
  { name: 'timestamp', type: 'number', description: 'Server-based timestamp of when the event occurred, with millisecond precision' },
  { name: 'combatEvent', type: 'string', description: 'The sub-event type (e.g. SWING_DAMAGE, SPELL_HEAL)' },
  { name: 'sourceGUID', type: 'string', description: 'Globally Unique Identifier of the source actor' },
  { name: 'sourceName', type: 'string', description: 'Name of the source actor' },
  { name: 'sourceFlags', type: 'number', description: 'Bit field containing information about the source actor (type, relationship, etc.)' },
  { name: 'destGUID', type: 'string', description: 'Globally Unique Identifier of the destination actor' },
  { name: 'destName', type: 'string', description: 'Name of the destination actor' },
  { name: 'destFlags', type: 'number', description: 'Bit field containing information about the destination actor' },
]

const SPELL_PREFIX_ARGS: CombatLogArgument[] = [
  { name: 'spellId', type: 'number', description: 'Numeric identifier for the spell' },
  { name: 'spellName', type: 'string', description: 'Name of the spell' },
  { name: 'spellSchool', type: 'number', description: 'School of the spell (bit field)' },
]

const DAMAGE_ARGS: CombatLogArgument[] = [
  { name: 'amount', type: 'number', description: 'Amount of damage inflicted' },
  { name: 'overkill', type: 'number', description: 'Amount of overkill damage (extra damage beyond killing the target)' },
  { name: 'school', type: 'number', description: 'School of the inflicted damage' },
  { name: 'resisted', type: 'number', description: 'Amount of damage resisted due to magical resistance' },
  { name: 'blocked', type: 'number', description: 'Amount of damage blocked by a physical shield' },
  { name: 'absorbed', type: 'number', description: 'Amount of damage absorbed by a spell or ability, or nil' },
  { name: 'critical', type: '1nil', description: '1 if the damage was a critical hit, otherwise nil' },
  { name: 'glancing', type: '1nil', description: '1 if the damage was a glancing blow, otherwise nil' },
  { name: 'crushing', type: '1nil', description: '1 if the damage was a crushing blow, otherwise nil' },
]

const HEAL_ARGS: CombatLogArgument[] = [
  { name: 'amount', type: 'number', description: 'Amount of healing that occurred' },
  { name: 'overhealing', type: 'number', description: 'Amount of healing beyond full health' },
  { name: 'absorbed', type: 'number', description: 'Amount of healing that was absorbed' },
  { name: 'critical', type: '1nil', description: '1 if the heal was a critical heal, otherwise nil' },
]

const MISS_ARGS: CombatLogArgument[] = [
  {
    name: 'missType', type: 'string', description: 'Type of miss that occurred',
    values: [
      { value: 'ABSORB', label: 'Absorbed' },
      { value: 'BLOCK', label: 'Blocked' },
      { value: 'DEFLECT', label: 'Deflected' },
      { value: 'DODGE', label: 'Dodged' },
      { value: 'EVADE', label: 'Evaded' },
      { value: 'IMMUNE', label: 'Immune' },
      { value: 'MISS', label: 'Missed' },
      { value: 'PARRY', label: 'Parried' },
      { value: 'REFLECT', label: 'Reflected' },
      { value: 'RESIST', label: 'Resisted' },
    ],
  },
  { name: 'amountMissed', type: 'number', description: 'Amount of damage that missed' },
]

const ENERGIZE_ARGS: CombatLogArgument[] = [
  { name: 'amount', type: 'number', description: 'Amount of power gained' },
  {
    name: 'powerType', type: 'number', description: 'Type of power gained',
    values: [
      { value: '-2', label: 'Health' },
      { value: '0', label: 'Mana' },
      { value: '1', label: 'Rage' },
      { value: '2', label: 'Focus (pets)' },
      { value: '3', label: 'Energy' },
      { value: '4', label: 'Pet happiness' },
      { value: '5', label: 'Runes' },
      { value: '6', label: 'Runic power' },
    ],
  },
]

const DRAIN_ARGS: CombatLogArgument[] = [
  ...ENERGIZE_ARGS,
  { name: 'extraAmount', type: 'number', description: 'Extra amount of power gained as a bonus (e.g. Viper Sting awards 300% of the power leeched)' },
]

const AURA_TYPE_ARG: CombatLogArgument = {
  name: 'auraType', type: 'string', description: 'Type of the aura',
  values: [
    { value: 'BUFF', label: 'Buff' },
    { value: 'DEBUFF', label: 'Debuff' },
  ],
}

const EXTRA_SPELL_ARGS: CombatLogArgument[] = [
  { name: 'extraSpellID', type: 'number', description: 'Numeric identifier for the affected spell' },
  { name: 'extraSpellName', type: 'string', description: 'Name of the affected spell' },
  { name: 'extraSchool', type: 'number', description: 'School of the affected spell' },
]

export const COMBAT_LOG_PREFIXES = [
  {
    name: 'SWING',
    description: 'Auto-attack (melee) damage. No additional prefix arguments.',
    arguments: [],
  },
  {
    name: 'RANGE',
    description: 'Ranged attacks such as auto shot, shoot bow/gun/crossbow/wand, and throwing.',
    arguments: SPELL_PREFIX_ARGS,
  },
  {
    name: 'SPELL',
    description: 'All spellcast events, as well as other types of non-periodic spell actions.',
    arguments: SPELL_PREFIX_ARGS,
  },
  {
    name: 'SPELL_PERIODIC',
    description: 'Periodic spell effects (DoTs and HoTs).',
    arguments: SPELL_PREFIX_ARGS,
  },
  {
    name: 'SPELL_BUILDING',
    description: 'Spell effects on buildings/structures (e.g. Wintergrasp).',
    arguments: SPELL_PREFIX_ARGS,
  },
  {
    name: 'ENVIRONMENTAL',
    description: 'Damage caused by the environment: bonfires, lava, falling, drowning.',
    arguments: [
      {
        name: 'environmentType', type: 'string', description: 'Type of environmental damage',
        values: [
          { value: 'Drowning', label: 'Drowning' },
          { value: 'Falling', label: 'Falling' },
          { value: 'Fatigue', label: 'Fatigue' },
          { value: 'Fire', label: 'Fire' },
          { value: 'Lava', label: 'Lava' },
          { value: 'Slime', label: 'Slime' },
        ],
      },
    ],
  },
]

export const COMBAT_LOG_SUB_EVENTS: CombatLogSubEvent[] = [
  // ===== DAMAGE SUFFIXES =====
  {
    name: 'SWING_DAMAGE',
    description: 'Fires when auto-attack (melee) damage is dealt to the destination actor.',
    type: 'suffix',
    prefixes: ['SWING'],
    arguments: DAMAGE_ARGS,
    bookPage: 429,
  },
  {
    name: 'RANGE_DAMAGE',
    description: 'Fires when ranged attack damage is dealt to the destination actor.',
    type: 'suffix',
    prefixes: ['RANGE'],
    arguments: DAMAGE_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_DAMAGE',
    description: 'Fires when spell damage is dealt to the destination actor.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: DAMAGE_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_PERIODIC_DAMAGE',
    description: 'Fires when periodic spell damage (DoT tick) is dealt to the destination actor.',
    type: 'suffix',
    prefixes: ['SPELL_PERIODIC'],
    arguments: DAMAGE_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_BUILDING_DAMAGE',
    description: 'Fires when spell damage is dealt to a building or structure.',
    type: 'suffix',
    prefixes: ['SPELL_BUILDING'],
    arguments: DAMAGE_ARGS,
    bookPage: 429,
  },
  {
    name: 'ENVIRONMENTAL_DAMAGE',
    description: 'Fires when environmental damage (fire, lava, falling, drowning) is dealt.',
    type: 'suffix',
    prefixes: ['ENVIRONMENTAL'],
    arguments: DAMAGE_ARGS,
    bookPage: 429,
  },

  // ===== MISS SUFFIXES =====
  {
    name: 'SWING_MISSED',
    description: 'Fires when an auto-attack misses in some way (dodge, parry, block, etc.).',
    type: 'suffix',
    prefixes: ['SWING'],
    arguments: MISS_ARGS,
    bookPage: 429,
  },
  {
    name: 'RANGE_MISSED',
    description: 'Fires when a ranged attack misses.',
    type: 'suffix',
    prefixes: ['RANGE'],
    arguments: MISS_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_MISSED',
    description: 'Fires when a spell misses, is resisted, absorbed, or otherwise fails to connect.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: MISS_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_PERIODIC_MISSED',
    description: 'Fires when a periodic spell effect misses.',
    type: 'suffix',
    prefixes: ['SPELL_PERIODIC'],
    arguments: MISS_ARGS,
    bookPage: 429,
  },

  // ===== HEAL SUFFIXES =====
  {
    name: 'SPELL_HEAL',
    description: 'Fires when a direct healing spell heals the destination actor.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: HEAL_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_PERIODIC_HEAL',
    description: 'Fires when a periodic healing effect (HoT tick) heals the destination actor.',
    type: 'suffix',
    prefixes: ['SPELL_PERIODIC'],
    arguments: HEAL_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_BUILDING_HEAL',
    description: 'Fires when a healing effect heals a building or structure.',
    type: 'suffix',
    prefixes: ['SPELL_BUILDING'],
    arguments: HEAL_ARGS,
    bookPage: 429,
  },

  // ===== CAST SUFFIXES (SPELL only) =====
  {
    name: 'SPELL_CAST_START',
    description: 'Fires when a spell cast begins. Only fires for spells with a cast time.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'SPELL_CAST_SUCCESS',
    description: 'Fires when a spell is cast successfully, including channeled and instant cast spells.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'SPELL_CAST_FAILED',
    description: 'Fires when a spell cast has failed for some reason.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      { name: 'failedType', type: 'string', description: 'Message indicating why the spell cast failed' },
    ],
    bookPage: 429,
  },

  // ===== ENERGIZE SUFFIXES =====
  {
    name: 'SPELL_ENERGIZE',
    description: 'Fires when an actor gains health, mana, or other power through a direct spell effect.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: ENERGIZE_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_PERIODIC_ENERGIZE',
    description: 'Fires when an actor gains power through a periodic spell effect.',
    type: 'suffix',
    prefixes: ['SPELL_PERIODIC'],
    arguments: ENERGIZE_ARGS,
    bookPage: 429,
  },

  // ===== LEECH SUFFIXES =====
  {
    name: 'SPELL_LEECH',
    description: 'Fires when an actor steals a resource from the target (e.g. Drain Mana, Viper Sting).',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: DRAIN_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_PERIODIC_LEECH',
    description: 'Fires when an actor periodically steals a resource from the target.',
    type: 'suffix',
    prefixes: ['SPELL_PERIODIC'],
    arguments: DRAIN_ARGS,
    bookPage: 429,
  },

  // ===== DRAIN SUFFIXES =====
  {
    name: 'SPELL_DRAIN',
    description: 'Fires when an actor drains a resource from the target.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: DRAIN_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_PERIODIC_DRAIN',
    description: 'Fires when an actor periodically drains a resource from the target.',
    type: 'suffix',
    prefixes: ['SPELL_PERIODIC'],
    arguments: DRAIN_ARGS,
    bookPage: 429,
  },

  // ===== SPELL-ONLY SUFFIXES =====
  {
    name: 'SPELL_SUMMON',
    description: 'Fires when an actor summons an NPC such as a totem or non-combat pet.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'SPELL_RESURRECT',
    description: 'Fires when a player is resurrected.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'SPELL_CREATE',
    description: 'Fires when a new object is created (as opposed to summoned NPCs), such as a mage portal.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'SPELL_INSTAKILL',
    description: 'Fires when a spell instantly kills an actor.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'SPELL_INTERRUPT',
    description: 'Fires when a spell is interrupted. The prefix spell arguments identify the ability responsible for the interruption.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: EXTRA_SPELL_ARGS,
    bookPage: 429,
  },
  {
    name: 'SPELL_EXTRA_ATTACKS',
    description: 'Fires when an actor does additional damage through extra attacks (e.g. Windfury Weapon, Thrash Blade proc).',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      { name: 'amount', type: 'number', description: 'Number of extra attacks granted by the ability' },
    ],
    bookPage: 429,
  },
  {
    name: 'SPELL_DURABILITY_DAMAGE',
    description: 'Fires when a spell or ability causes damage to an actor\'s items (e.g. Nefarian\'s hunter call, Ragnaros\' Melt Weapon).',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'SPELL_DURABILITY_DAMAGE_ALL',
    description: 'Fires when a spell or ability causes damage to all of an actor\'s items.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [],
    bookPage: 429,
  },

  // ===== AURA SUFFIXES =====
  {
    name: 'SPELL_AURA_APPLIED',
    description: 'Fires when an aura (buff or debuff) is applied to an actor.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [AURA_TYPE_ARG],
    bookPage: 429,
  },
  {
    name: 'SPELL_AURA_APPLIED_DOSE',
    description: 'Fires when a stackable aura is applied to an actor (e.g. Lifebloom, Penance).',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      AURA_TYPE_ARG,
      { name: 'amount', type: 'number', description: 'Number of doses applied' },
    ],
    bookPage: 429,
  },
  {
    name: 'SPELL_AURA_REFRESH',
    description: 'Fires when an aura is refreshed with a new application.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [AURA_TYPE_ARG],
    bookPage: 429,
  },
  {
    name: 'SPELL_AURA_REMOVED',
    description: 'Fires when an aura is removed from an actor.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [AURA_TYPE_ARG],
    bookPage: 429,
  },
  {
    name: 'SPELL_AURA_REMOVED_DOSE',
    description: 'Fires when a dose is removed from a stackable aura.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      AURA_TYPE_ARG,
      { name: 'amount', type: 'number', description: 'Number of doses removed' },
    ],
    bookPage: 429,
  },
  {
    name: 'SPELL_AURA_BROKEN',
    description: 'Fires when an aura has been broken by damage.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [AURA_TYPE_ARG],
    bookPage: 429,
  },
  {
    name: 'SPELL_AURA_BROKEN_SPELL',
    description: 'Fires when an aura has been broken by a spell.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      ...EXTRA_SPELL_ARGS,
      AURA_TYPE_ARG,
    ],
    bookPage: 429,
  },
  {
    name: 'SPELL_DISPEL',
    description: 'Fires when an aura is dispelled.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      ...EXTRA_SPELL_ARGS,
      AURA_TYPE_ARG,
    ],
    bookPage: 429,
  },
  {
    name: 'SPELL_DISPEL_FAILED',
    description: 'Fires when an aura fails to be dispelled.',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      ...EXTRA_SPELL_ARGS,
      AURA_TYPE_ARG,
    ],
    bookPage: 429,
  },
  {
    name: 'SPELL_STOLEN',
    description: 'Fires when an aura is stolen (e.g. Spellsteal).',
    type: 'suffix',
    prefixes: ['SPELL'],
    arguments: [
      ...EXTRA_SPELL_ARGS,
      AURA_TYPE_ARG,
    ],
    bookPage: 429,
  },

  // ===== SPECIAL EVENTS (no prefix/suffix convention) =====
  {
    name: 'DAMAGE_SHIELD',
    description: 'Fires when a damage shield (e.g. Thorns, Retribution Aura) causes damage to an attacker. Uses SPELL prefix args + DAMAGE suffix args.',
    type: 'special',
    arguments: [...SPELL_PREFIX_ARGS, ...DAMAGE_ARGS],
    bookPage: 429,
  },
  {
    name: 'DAMAGE_SPLIT',
    description: 'Fires when damage is split among multiple targets. Uses SPELL prefix args + DAMAGE suffix args.',
    type: 'special',
    arguments: [...SPELL_PREFIX_ARGS, ...DAMAGE_ARGS],
    bookPage: 429,
  },
  {
    name: 'DAMAGE_SHIELD_MISSED',
    description: 'Fires when a damage shield causes damage that misses. Uses SPELL prefix args + MISSED suffix args.',
    type: 'special',
    arguments: [...SPELL_PREFIX_ARGS, ...MISS_ARGS],
    bookPage: 429,
  },
  {
    name: 'ENCHANT_APPLIED',
    description: 'Fires when an enchantment is applied to an item.',
    type: 'special',
    arguments: [
      { name: 'spellName', type: 'string', description: 'Name of the enchantment' },
      { name: 'itemID', type: 'number', description: 'Numeric identifier of the item' },
      { name: 'itemName', type: 'string', description: 'Name of the item that was enchanted' },
    ],
    bookPage: 429,
  },
  {
    name: 'ENCHANT_REMOVED',
    description: 'Fires when an enchantment is removed from an item.',
    type: 'special',
    arguments: [
      { name: 'spellName', type: 'string', description: 'Name of the enchantment' },
      { name: 'itemID', type: 'number', description: 'Numeric identifier of the item' },
      { name: 'itemName', type: 'string', description: 'Name of the item that was enchanted' },
    ],
    bookPage: 429,
  },
  {
    name: 'PARTY_KILL',
    description: 'Fires when a member of your party kills a unit.',
    type: 'special',
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'UNIT_DIED',
    description: 'Fires when a unit dies.',
    type: 'special',
    arguments: [],
    bookPage: 429,
  },
  {
    name: 'UNIT_DESTROYED',
    description: 'Fires when a unit (building/structure) is destroyed.',
    type: 'special',
    arguments: [],
    bookPage: 429,
  },
]

export const STANDARD_COMBAT_LOG_ARGS = STANDARD_ARGS

export const SPELL_SCHOOLS = [
  { value: 1, name: 'Physical', binary: '00000001' },
  { value: 2, name: 'Holy', binary: '00000010' },
  { value: 4, name: 'Fire', binary: '00000100' },
  { value: 8, name: 'Nature', binary: '00001000' },
  { value: 16, name: 'Frost', binary: '00010000' },
  { value: 32, name: 'Shadow', binary: '00100000' },
  { value: 64, name: 'Arcane', binary: '01000000' },
  { value: 20, name: 'Frostfire', binary: '00010100' },
]
