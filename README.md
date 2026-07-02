## Ignis-Redux-11

This is a fork of EDOPro by the Project Ignis team.<br>
The cardpool cuts off on 24.06.2011 (last TCG release before XYZs + selected bonus cards, including even a few XYZs).<br>
Duels default to the `Redux-11` ruleset: Master Rule 1 with `First turn draw` disabled.<br>
By default, cards use their latest Master Rule 1 version / errata.<br>
Ignis-Redux-11 uses custom erratas and a custom banned list (check below)<br>
Redux-owned card image overrides live in `Redux/assets/pics/`; root `/pics` is
only a local cache.<br>

<details>
<summary><strong><big>How to install</big></strong></summary>

- Pick a download method:
  - Clone this repository with Git (easier updates).
  - Download the ZIP from GitHub and extract it.
- Follow the ZeroTier guide below to play online.
- Run `Ignis-Redux-11.exe`.

</details>

<details>
<summary><strong><big>How to play online with ZeroTier</big></strong></summary>

To play Ignis-Redux-11 online, we need to use [ZeroTier](https://www.zerotier.com/download/) as a virtual LAN. <br>
Download and install it, then join the Ignis-Redux-11 network: `633e31d8a2239542`

New user must be approved by the network owner. The [network admin panel](https://central.zerotier.com/9KVurE4Z2pALrLbFBxWPmq/network) is linked to the `WhiteG00se` GitHub account.

Hosting player:

1. Select `LAN + AI`.
2. Host a room on port `7911`.
3. In Administrator PowerShell, allow inbound connections to port `7911`:

```powershell
New-NetFirewallRule -DisplayName "Ignis-Redux-11 host port 7911" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 7911
```

4. Tell the other player your ZeroTier IPv4 address.

Joining player:

1. Select `LAN + AI`.
2. Enter the host's ZeroTier IPv4 address & port `7911`, then click `Join`.

If joining fails, the host should make the ZeroTier network
Private. In Administrator PowerShell run: `Get-NetConnectionProfile`

Find the `ZeroTier One [...]` interface, then replace `10` below with that interface's `InterfaceIndex` if it is different:

```powershell
Set-NetConnectionProfile -InterfaceIndex 10 -NetworkCategory Private
```

The joining player can test the host before opening EDOPro:

```powershell
Test-NetConnection -ComputerName HOST_ZEROTIER_IP -Port 7911
```

`TcpTestSucceeded : True` means the network and firewall path is open.

</details>

<details>
<summary><strong><big>Redux Errata</big></strong></summary>

Redux card versions are marked with golden frame and a golden "R". Their name also starts with "[Redux]".<br>
Redux Limits: `0` = forbidden; `1` = limited; `2` = semi-limited; `3` = unlimited. Errata: `⬇️ nerf`; `⬆️ buff`; `🔄 rework`.

<!-- ORDER BY Redux Limit, Cardname-->
<!-- prettier-ignore -->
| Cardname | Changes |
| --- | --- |
| `1` [Black Luster Soldier - Envoy of the Beginning](https://yugioh.fandom.com/wiki/Black_Luster_Soldier_-_Envoy_of_the_Beginning) | ⬇️ Face-up banish only; second attack deals no damage |
| `1` [Brionac, Dragon of the Ice Barrier](https://yugioh.fandom.com/wiki/Brionac,_Dragon_of_the_Ice_Barrier) | ⬇️ Once per turn |
| `1` [Change of Heart](https://yugioh.fandom.com/wiki/Change_of_Heart) | ⬇️ Discard 1; stolen monster: no battle damage while on field |
| `1` [Chaos Emperor Dragon - Envoy of the End](https://yugioh.fandom.com/wiki/Chaos_Emperor_Dragon_-_Envoy_of_the_End) | 🔄 Banish 3 LIGHT or DARK monsters (at least 1 each); summon effect has no LP cost; destroy other cards; both gain 300 LP per card |
| `1` [Cyber-Stein](https://yugioh.fandom.com/wiki/Cyber-Stein) | 🔄 Counts as Cyber; summon/flip trigger; no LP cost; Fusion monster: Defense Position & 0 ATK; Level 7+ effects negated |
| `1` [Dark Hole](https://yugioh.fandom.com/wiki/Dark_Hole) | ⬇️ No battle damage |
| `1` [Dark Magician of Chaos](https://yugioh.fandom.com/wiki/Dark_Magician_of_Chaos) | ⬇️ Once per turn |
| `1` [Dark Strike Fighter](https://yugioh.fandom.com/wiki/Dark_Strike_Fighter) | ⬇️ Once per turn |
| `1` [Elemental HERO Stratos](https://yugioh.fandom.com/wiki/Elemental_HERO_Stratos) | ⬇️ Once per turn |
| `1` [Fiber Jar](https://yugioh.fandom.com/wiki/Fiber_Jar) | 🔄 Tuner; summon/flip trigger; sets both players to 8000 LP |
| `1` [Fishborg Blaster](https://yugioh.fandom.com/wiki/Fishborg_Blaster) | ⬇️ Once per turn |
| `1` [Gravity Bind](https://yugioh.fandom.com/wiki/Gravity_Bind) | ⬇️ End Phase upkeep; optional 1000 LP |
| `1` [Imperial Order](https://yugioh.fandom.com/wiki/Imperial_Order) | ⬇️ End Phase upkeep; optional 1700 LP |
| `1` [Last Will](https://yugioh.fandom.com/wiki/Last_Will) | ⬇️ Once per turn; no battle damage |
| `1` [Level Limit - Area B](https://yugioh.fandom.com/wiki/Level_Limit_-_Area_B) | ⬇️ End Phase upkeep; optional 1000 LP |
| `1` [Magical Scientist](https://yugioh.fandom.com/wiki/Magical_Scientist) | 🔄 Summon/flip trigger; no LP cost; Fusion monster: Defense Position, stays & no battle damage until your next End Phase |
| `1` [Messenger of Peace](https://yugioh.fandom.com/wiki/Messenger_of_Peace) | ⬇️ End Phase upkeep; optional 1000 LP |
| `1` [Painful Choice](https://yugioh.fandom.com/wiki/Painful_Choice) | ⬇️ Half LP; select 2 cards |
| `1` [Rescue Cat](https://yugioh.fandom.com/wiki/Rescue_Cat) | ⬇️ Once per turn |
| `1` [Ring of Destruction](https://yugioh.fandom.com/wiki/Ring_of_Destruction) | 🔄 Pay 1500 LP; both gain destroyed monster's ATK as LP |
| `1` [Sinister Serpent](https://yugioh.fandom.com/wiki/Sinister_Serpent) | ⬇️ Once per turn |
| `1` [Skill Drain](https://yugioh.fandom.com/wiki/Skill_Drain) | ⬆️ No LP cost |
| `1` [Solemn Warning](https://yugioh.fandom.com/wiki/Solemn_Warning) | ⬆️ Cost reduced to 1000 LP |
| `1` [Trishula, Dragon of the Ice Barrier](https://yugioh.fandom.com/wiki/Trishula,_Dragon_of_the_Ice_Barrier) | ⬇️ Once per duel |
| `1` [Yata-Garasu](https://yugioh.fandom.com/wiki/Yata-Garasu) | ⬇️ Skips Draw Phase unless opponent has 1 or fewer cards in hand |
| `2` [Dimension Fusion](https://yugioh.fandom.com/wiki/Dimension_Fusion) | 🔄 Once per turn; banishes 1 hand card as cost; banishes itself; no battle damage |
| `2` [Dupe Frog](https://yugioh.fandom.com/wiki/Dupe_Frog) | ⬇️ Searches in End Phase; once per turn; attacks can target any Des Frog |
| `2` [Gateway of the Six](https://yugioh.fandom.com/wiki/Gateway_of_the_Six) | ⬇️ 4 counters revive; 6 counters search; only 1 face-up |
| `2` [Graceful Charity](https://yugioh.fandom.com/wiki/Graceful_Charity) | ⬇️ Draw 3; banish 3 |
| `2` [Monster Reborn](https://yugioh.fandom.com/wiki/Monster_Reborn) | ⬇️ Discard 1; becomes Equip Spell; destroys revived monster if it leaves |
| `2` [Sangan](https://yugioh.fandom.com/wiki/Sangan) | ⬇️ Once per turn |
| `2` [Slime Toad](https://yugioh.fandom.com/wiki/Slime_Toad) | 🔄 Effect Tuner; always Frog; equips Frog from GY and gains stats |
| `2` [Substitoad](https://yugioh.fandom.com/wiki/Substitoad) | 🔄 Counts as Frog; Quick Effect; summons from hand/Deck/GY; each Frog twice per turn |
| `2` [Witch of the Black Forest](https://yugioh.fandom.com/wiki/Witch_of_the_Black_Forest) | ⬇️ Once per turn; searches less than 1000 DEF |
| `3` [Butterfly Dagger - Elma](https://yugioh.fandom.com/wiki/Butterfly_Dagger_-_Elma) | ⬆️ Equipped monster gains 800 ATK/DEF |
| `3` [Destiny HERO - Disk Commander](https://yugioh.fandom.com/wiki/Destiny_HERO_-_Disk_Commander) | 🔄 Once per turn; draw 1 on any Special Summon |
| `3` [Exchange of the Spirit](https://yugioh.fandom.com/wiki/Exchange_of_the_Spirit) | ⬇️ once per duel (later format official errata) |
| `3` [Makyura the Destructor](https://yugioh.fandom.com/wiki/Makyura_the_Destructor) | ⬆️ ATK/DEF: 1600/1200 to 1900/1900 |
| `3` [Mind Master](https://yugioh.fandom.com/wiki/Mind_Master) | ⬇️ Once per turn |
| `3` [Night Assailant](https://yugioh.fandom.com/wiki/Night_Assailant) | ⬇️ Once per turn |
| `3` [Raigeki](https://yugioh.fandom.com/wiki/Raigeki) | ⬇️ Discard 1; no battle damage |
| `3` [Ryko, Lightsworn Hunter](https://yugioh.fandom.com/wiki/Ryko,_Lightsworn_Hunter) | ⬇️ Target before resolving (master rule 1) |
| `3` [Swap Frog](https://yugioh.fandom.com/wiki/Swap_Frog) | ⬆️ Revert to Master Rule 1 version |
| `3` [The Last Warrior from Another Planet](https://yugioh.fandom.com/wiki/The_Last_Warrior_from_Another_Planet) | ⬇️ No monster destruction; only blocks Special Summons |
| `1` [Toad Master](https://yugioh.fandom.com/wiki/Toad_Master) | 🔄 Added; Effect Tuner; always Frog; discards WATER to summon; makes Tadpole Token |

</details>

<details>
<summary><strong><big>Banned List</big></strong></summary>

Redux Limits: `0` = forbidden; `1` = limited; `2` = semi-limited; `3` = unlimited. Errata: `⬇️ nerf`; `⬆️ buff`; `🔄 rework`.

<!-- ORDER BY Redux, Mar 2011, Sep 2011, Cardname -->
<!-- prettier-ignore -->
| Cardname | Mar 2011 | Redux | Sep 2011 | Errata |
| --- | :---: | :---: | :---: | :---: |
| [Brain Control](https://yugioh.fandom.com/wiki/Brain_Control) | 0 | `0` | 0 |  |
| [Card of Safe Return](https://yugioh.fandom.com/wiki/Card_of_Safe_Return) | 0 | `0` | 0 |  |
| [Cold Wave](https://yugioh.fandom.com/wiki/Cold_Wave) | 0 | `0` | 0 |  |
| [Confiscation](https://yugioh.fandom.com/wiki/Confiscation) | 0 | `0` | 0 |  |
| [Crush Card Virus](https://yugioh.fandom.com/wiki/Crush_Card_Virus) | 0 | `0` | 0 |  |
| [Cyber Jar](https://yugioh.fandom.com/wiki/Cyber_Jar) | 0 | `0` | 0 |  |
| [Delinquent Duo](https://yugioh.fandom.com/wiki/Delinquent_Duo) | 0 | `0` | 0 |  |
| [Exchange of the Spirit](https://yugioh.fandom.com/wiki/Exchange_of_the_Spirit) | 0 | `3` | 0 | ⬇️ |
| [Harpie's Feather Duster](https://yugioh.fandom.com/wiki/Harpie's_Feather_Duster) | 0 | `0` | 0 |  |
| [Last Turn](https://yugioh.fandom.com/wiki/Last_Turn) | 0 | `0` | 0 |  |
| [Mass Driver](https://yugioh.fandom.com/wiki/Mass_Driver) | 0 | `0` | 0 |  |
| [Mirage of Nightmare](https://yugioh.fandom.com/wiki/Mirage_of_Nightmare) | 0 | `0` | 0 |  |
| [Pot of Greed](https://yugioh.fandom.com/wiki/Pot_of_Greed) | 0 | `0` | 0 |  |
| [Snatch Steal](https://yugioh.fandom.com/wiki/Snatch_Steal) | 0 | `0` | 0 |  |
| [The Forceful Sentry](https://yugioh.fandom.com/wiki/The_Forceful_Sentry) | 0 | `0` | 0 |  |
| [Thousand-Eyes Restrict](https://yugioh.fandom.com/wiki/Thousand-Eyes_Restrict) | 0 | `0` | 0 |  |
| [Victory Dragon](https://yugioh.fandom.com/wiki/Victory_Dragon) | 0 | `0` | 0 |  |
| [Royal Oppression](https://yugioh.fandom.com/wiki/Royal_Oppression) | 1 | `0` | 0 |  |
| [Exodia the Forbidden One](https://yugioh.fandom.com/wiki/Exodia_the_Forbidden_One) | 1 | `0` | 1 |  |
| [Level Limit - Area B](https://yugioh.fandom.com/wiki/Level_Limit_-_Area_B) | 1 | `1` | 1 | ⬇️ |
| [Magical Explosion](https://yugioh.fandom.com/wiki/Magical_Explosion) | 1 | `0` | 1 |  |
| [Trap Dustshoot](https://yugioh.fandom.com/wiki/Trap_Dustshoot) | 1 | `0` | 1 |  |
| [Wall of Revealing Light](https://yugioh.fandom.com/wiki/Wall_of_Revealing_Light) | 1 | `0` | 1 |  |
| [Gravity Bind](https://yugioh.fandom.com/wiki/Gravity_Bind) | 1 | `1` | 3 | ⬇️ |
| [Final Countdown](https://yugioh.fandom.com/wiki/Final_Countdown) | 3 | `0` | 3 |  |
| [Gearfried the Iron Knight](https://yugioh.fandom.com/wiki/Gearfried_the_Iron_Knight) | 3 | `0` | 3 |  |
| [Maxx "C"](https://yugioh.fandom.com/wiki/Maxx_%22C%22) | 3 | `0` | 3 |  |
| [Change of Heart](https://yugioh.fandom.com/wiki/Change_of_Heart) | 0 | `1` | 0 | ⬇️ |
| [Chaos Emperor Dragon - Envoy of the End](https://yugioh.fandom.com/wiki/Chaos_Emperor_Dragon_-_Envoy_of_the_End) | 0 | `1` | 0 | 🔄 |
| [Cyber-Stein](https://yugioh.fandom.com/wiki/Cyber-Stein) | 0 | `1` | 0 | 🔄 |
| [Dark Magician of Chaos](https://yugioh.fandom.com/wiki/Dark_Magician_of_Chaos) | 0 | `1` | 0 | ⬇️ |
| [Dark Strike Fighter](https://yugioh.fandom.com/wiki/Dark_Strike_Fighter) | 0 | `1` | 0 | ⬇️ |
| [Fiber Jar](https://yugioh.fandom.com/wiki/Fiber_Jar) | 0 | `1` | 0 | 🔄 |
| [Goyo Guardian](https://yugioh.fandom.com/wiki/Goyo_Guardian) | 0 | `1` | 0 |  |
| [Imperial Order](https://yugioh.fandom.com/wiki/Imperial_Order) | 0 | `1` | 0 | ⬇️ |
| [Last Will](https://yugioh.fandom.com/wiki/Last_Will) | 0 | `1` | 0 | ⬇️ |
| [Magical Scientist](https://yugioh.fandom.com/wiki/Magical_Scientist) | 0 | `1` | 0 | 🔄 |
| [Painful Choice](https://yugioh.fandom.com/wiki/Painful_Choice) | 0 | `1` | 0 | ⬇️ |
| [Premature Burial](https://yugioh.fandom.com/wiki/Premature_Burial) | 0 | `1` | 0 |  |
| [Rescue Cat](https://yugioh.fandom.com/wiki/Rescue_Cat) | 0 | `1` | 0 | ⬇️ |
| [Ring of Destruction](https://yugioh.fandom.com/wiki/Ring_of_Destruction) | 0 | `1` | 0 | 🔄 |
| [Sinister Serpent](https://yugioh.fandom.com/wiki/Sinister_Serpent) | 0 | `1` | 0 | ⬇️ |
| [Yata-Garasu](https://yugioh.fandom.com/wiki/Yata-Garasu) | 0 | `1` | 0 | ⬇️ |
| [Black Luster Soldier - Envoy of the Beginning](https://yugioh.fandom.com/wiki/Black_Luster_Soldier_-_Envoy_of_the_Beginning) | 0 | `1` | 1 | ⬇️ |
| [Heavy Storm](https://yugioh.fandom.com/wiki/Heavy_Storm) | 0 | `1` | 1 |  |
| [Giant Trunade](https://yugioh.fandom.com/wiki/Giant_Trunade) | 1 | `1` | 0 |  |
| [Black Whirlwind](https://yugioh.fandom.com/wiki/Black_Whirlwind) | 1 | `1` | 1 |  |
| [Blackwing - Gale the Whirlwind](https://yugioh.fandom.com/wiki/Blackwing_-_Gale_the_Whirlwind) | 1 | `1` | 1 |  |
| [Blackwing - Kalut the Moon Shadow](https://yugioh.fandom.com/wiki/Blackwing_-_Kalut_the_Moon_Shadow) | 1 | `1` | 1 |  |
| [Brionac, Dragon of the Ice Barrier](https://yugioh.fandom.com/wiki/Brionac,_Dragon_of_the_Ice_Barrier) | 1 | `1` | 1 | ⬇️ |
| [Card Destruction](https://yugioh.fandom.com/wiki/Card_Destruction) | 1 | `1` | 1 |  |
| [Ceasefire](https://yugioh.fandom.com/wiki/Ceasefire) | 1 | `1` | 1 |  |
| [Charge of the Light Brigade](https://yugioh.fandom.com/wiki/Charge_of_the_Light_Brigade) | 1 | `1` | 1 |  |
| [Dark Armed Dragon](https://yugioh.fandom.com/wiki/Dark_Armed_Dragon) | 1 | `1` | 1 |  |
| [Dark Hole](https://yugioh.fandom.com/wiki/Dark_Hole) | 1 | `1` | 1 | ⬇️ |
| [Elemental HERO Stratos](https://yugioh.fandom.com/wiki/Elemental_HERO_Stratos) | 1 | `1` | 1 | ⬇️ |
| [Future Fusion](https://yugioh.fandom.com/wiki/Future_Fusion) | 1 | `1` | 1 |  |
| [Gorz the Emissary of Darkness](https://yugioh.fandom.com/wiki/Gorz_the_Emissary_of_Darkness) | 1 | `1` | 1 |  |
| [Honest](https://yugioh.fandom.com/wiki/Honest) | 1 | `1` | 1 |  |
| [Infernity Launcher](https://yugioh.fandom.com/wiki/Infernity_Launcher) | 1 | `1` | 1 |  |
| [Limiter Removal](https://yugioh.fandom.com/wiki/Limiter_Removal) | 1 | `1` | 1 |  |
| [Marshmallon](https://yugioh.fandom.com/wiki/Marshmallon) | 1 | `1` | 1 |  |
| [Messenger of Peace](https://yugioh.fandom.com/wiki/Messenger_of_Peace) | 1 | `1` | 1 | ⬇️ |
| [Mind Control](https://yugioh.fandom.com/wiki/Mind_Control) | 1 | `1` | 1 |  |
| [Mirror Force](https://yugioh.fandom.com/wiki/Mirror_Force) | 1 | `1` | 1 |  |
| [Morphing Jar](https://yugioh.fandom.com/wiki/Morphing_Jar) | 1 | `1` | 1 |  |
| [Neo-Spacian Grand Mole](https://yugioh.fandom.com/wiki/Neo-Spacian_Grand_Mole) | 1 | `1` | 1 |  |
| [Solemn Judgment](https://yugioh.fandom.com/wiki/Solemn_Judgment) | 1 | `1` | 1 |  |
| [Torrential Tribute](https://yugioh.fandom.com/wiki/Torrential_Tribute) | 1 | `1` | 1 |  |
| [Mind Crush](https://yugioh.fandom.com/wiki/Mind_Crush) | 1 | `1` | 2 |  |
| [Swords of Revealing Light](https://yugioh.fandom.com/wiki/Swords_of_Revealing_Light) | 1 | `1` | 2 |  |
| [Chain Strike](https://yugioh.fandom.com/wiki/Chain_Strike) | 2 | `1` | 2 |  |
| [Magic Cylinder](https://yugioh.fandom.com/wiki/Magic_Cylinder) | 2 | `1` | 2 |  |
| [Ojama Trio](https://yugioh.fandom.com/wiki/Ojama_Trio) | 2 | `1` | 2 |  |
| [Royal Tribute](https://yugioh.fandom.com/wiki/Royal_Tribute) | 2 | `1` | 2 |  |
| [Solemn Warning](https://yugioh.fandom.com/wiki/Solemn_Warning) | 2 | `1` | 2 | ⬆️ |
| [Mystical Space Typhoon](https://yugioh.fandom.com/wiki/Mystical_Space_Typhoon) | 2 | `1` | 3 |  |
| [Fishborg Blaster](https://yugioh.fandom.com/wiki/Fishborg_Blaster) | 3 | `1` | 0 | ⬇️ |
| [Legendary Six Samurai - Shi En](https://yugioh.fandom.com/wiki/Legendary_Six_Samurai_-_Shi_En) | 3 | `1` | 1 |  |
| [Primal Seed](https://yugioh.fandom.com/wiki/Primal_Seed) | 3 | `1` | 1 |  |
| [Shien's Smoke Signal](https://yugioh.fandom.com/wiki/Shien's_Smoke_Signal) | 3 | `1` | 1 |  |
| [T.G. Hyper Librarian](https://yugioh.fandom.com/wiki/T.G._Hyper_Librarian) | 3 | `1` | 1 |  |
| [Trishula, Dragon of the Ice Barrier](https://yugioh.fandom.com/wiki/Trishula,_Dragon_of_the_Ice_Barrier) | 3 | `1` | 1 | ⬇️ |
| [Morphing Jar #2](https://yugioh.fandom.com/wiki/Morphing_Jar_2) | 3 | `1` | 2 |  |
| [Black Rose Dragon](https://yugioh.fandom.com/wiki/Black_Rose_Dragon) | 3 | `1` | 3 |  |
| [Deck Devastation Virus](https://yugioh.fandom.com/wiki/Deck_Devastation_Virus) | 3 | `1` | 3 |  |
| [E - Emergency Call](https://yugioh.fandom.com/wiki/E_-_Emergency_Call) | 3 | `1` | 3 |  |
| [Eradicator Epidemic Virus](https://yugioh.fandom.com/wiki/Eradicator_Epidemic_Virus) | 3 | `1` | 3 |  |
| [Gachi Gachi Gantetsu](https://yugioh.fandom.com/wiki/Gachi_Gachi_Gantetsu) | 3 | `1` | 3 |  |
| [Gladiator Beast War Chariot](https://yugioh.fandom.com/wiki/Gladiator_Beast_War_Chariot) | 3 | `1` | 3 |  |
| [Gozen Match](https://yugioh.fandom.com/wiki/Gozen_Match) | 3 | `1` | 3 |  |
| [Rivalry of Warlords](https://yugioh.fandom.com/wiki/Rivalry_of_Warlords) | 3 | `1` | 3 |  |
| [Skill Drain](https://yugioh.fandom.com/wiki/Skill_Drain) | 3 | `1` | 3 | ⬆️ |
| [Symbol of Heritage](https://yugioh.fandom.com/wiki/Symbol_of_Heritage) | 3 | `1` | 3 |  |
| [Graceful Charity](https://yugioh.fandom.com/wiki/Graceful_Charity) | 0 | `2` | 0 | ⬇️ |
| [Dimension Fusion](https://yugioh.fandom.com/wiki/Dimension_Fusion) | 0 | `2` | 0 | 🔄 |
| [Substitoad](https://yugioh.fandom.com/wiki/Substitoad) | 0 | `2` | 0 | 🔄 |
| [Witch of the Black Forest](https://yugioh.fandom.com/wiki/Witch_of_the_Black_Forest) | 0 | `2` | 0 | ⬇️ |
| [Tsukuyomi](https://yugioh.fandom.com/wiki/Tsukuyomi) | 0 | `2` | 0 |  |
| [Advanced Ritual Art](https://yugioh.fandom.com/wiki/Advanced_Ritual_Art) | 1 | `2` | 1 |  |
| [Book of Moon](https://yugioh.fandom.com/wiki/Book_of_Moon) | 1 | `2` | 1 |  |
| [Burial from a Different Dimension](https://yugioh.fandom.com/wiki/Burial_from_a_Different_Dimension) | 1 | `2` | 1 |  |
| [Dandylion](https://yugioh.fandom.com/wiki/Dandylion) | 1 | `2` | 1 |  |
| [Emergency Teleport](https://yugioh.fandom.com/wiki/Emergency_Teleport) | 1 | `2` | 1 |  |
| [Foolish Burial](https://yugioh.fandom.com/wiki/Foolish_Burial) | 1 | `2` | 1 |  |
| [Gateway of the Six](https://yugioh.fandom.com/wiki/Gateway_of_the_Six) | 1 | `2` | 1 | ⬇️ |
| [Gladiator Beast Bestiari](https://yugioh.fandom.com/wiki/Gladiator_Beast_Bestiari) | 1 | `2` | 1 |  |
| [Lumina, Lightsworn Summoner](https://yugioh.fandom.com/wiki/Lumina,_Lightsworn_Summoner) | 1 | `2` | 1 |  |
| [Mezuki](https://yugioh.fandom.com/wiki/Mezuki) | 1 | `2` | 1 |  |
| [Monster Reborn](https://yugioh.fandom.com/wiki/Monster_Reborn) | 1 | `2` | 1 | ⬇️ |
| [Necroface](https://yugioh.fandom.com/wiki/Necroface) | 1 | `2` | 1 |  |
| [One for One](https://yugioh.fandom.com/wiki/One_for_One) | 1 | `2` | 1 |  |
| [Plaguespreader Zombie](https://yugioh.fandom.com/wiki/Plaguespreader_Zombie) | 1 | `2` | 1 |  |
| [Reasoning](https://yugioh.fandom.com/wiki/Reasoning) | 1 | `2` | 1 |  |
| [Reinforcement of the Army](https://yugioh.fandom.com/wiki/Reinforcement_of_the_Army) | 1 | `2` | 1 |  |
| [Return from the Different Dimension](https://yugioh.fandom.com/wiki/Return_from_the_Different_Dimension) | 1 | `2` | 1 |  |
| [Sangan](https://yugioh.fandom.com/wiki/Sangan) | 1 | `2` | 1 | ⬇️ |
| [Scapegoat](https://yugioh.fandom.com/wiki/Scapegoat) | 1 | `2` | 1 |  |
| [Spiritual Water Art - Aoi](https://yugioh.fandom.com/wiki/Spiritual_Water_Art_-_Aoi) | 1 | `2` | 1 |  |
| [Call of the Haunted](https://yugioh.fandom.com/wiki/Call_of_the_Haunted) | 1 | `2` | 2 |  |
| [Necro Gardna](https://yugioh.fandom.com/wiki/Necro_Gardna) | 1 | `2` | 2 |  |
| [Archlord Kristya](https://yugioh.fandom.com/wiki/Archlord_Kristya) | 2 | `2` | 2 |  |
| [Bottomless Trap Hole](https://yugioh.fandom.com/wiki/Bottomless_Trap_Hole) | 2 | `2` | 2 |  |
| [Destiny HERO - Malicious](https://yugioh.fandom.com/wiki/Destiny_HERO_-_Malicious) | 2 | `2` | 2 |  |
| [Icarus Attack](https://yugioh.fandom.com/wiki/Icarus_Attack) | 2 | `2` | 3 |  |
| [Megamorph](https://yugioh.fandom.com/wiki/Megamorph) | 2 | `2` | 3 |  |
| [Formula Synchron](https://yugioh.fandom.com/wiki/Formula_Synchron) | 3 | `2` | 1 |  |
| [Pot of Avarice](https://yugioh.fandom.com/wiki/Pot_of_Avarice) | 3 | `2` | 1 |  |
| [Dupe Frog](https://yugioh.fandom.com/wiki/Dupe_Frog) | 3 | `2` | 3 | ⬇️ |
| [Dimensional Fissure](https://yugioh.fandom.com/wiki/Dimensional_Fissure) | 3 | `1` | 3 |  |
| [Kaiser Colosseum](https://yugioh.fandom.com/wiki/Kaiser_Colosseum) | 3 | `1` | 3 |  |
| [King Tiger Wanghu](https://yugioh.fandom.com/wiki/King_Tiger_Wanghu) | 3 | `1` | 3 |  |
| [Macro Cosmos](https://yugioh.fandom.com/wiki/Macro_Cosmos) | 3 | `1` | 3 |  |
| [Saber Hole](https://yugioh.fandom.com/wiki/Saber_Hole) | 3 | `2` | 3 |  |
| [Slime Toad](https://yugioh.fandom.com/wiki/Slime_Toad) | 3 | `2` | 3 | 🔄 |
| [Self-Destruct Button](https://yugioh.fandom.com/wiki/Self-Destruct_Button) | 3 | `0` | 3 |  |
| [Butterfly Dagger - Elma](https://yugioh.fandom.com/wiki/Butterfly_Dagger_-_Elma) | 0 | `3` | 0 | ⬆️ |
| [Destiny HERO - Disk Commander](https://yugioh.fandom.com/wiki/Destiny_HERO_-_Disk_Commander) | 0 | `3` | 0 | 🔄 |
| [Magician of Faith](https://yugioh.fandom.com/wiki/Magician_of_Faith) | 0 | `3` | 0 |  |
| [Makyura the Destructor](https://yugioh.fandom.com/wiki/Makyura_the_Destructor) | 0 | `3` | 0 | ⬆️ |
| [Metamorphosis](https://yugioh.fandom.com/wiki/Metamorphosis) | 0 | `3` | 0 |  |
| [Raigeki](https://yugioh.fandom.com/wiki/Raigeki) | 0 | `1` | 0 | ⬇️ |
| [Temple of the Kings](https://yugioh.fandom.com/wiki/Temple_of_the_Kings) | 0 | `3` | 0 |  |
| [Time Seal](https://yugioh.fandom.com/wiki/Time_Seal) | 0 | `3` | 0 |  |
| [Tribe-Infecting Virus](https://yugioh.fandom.com/wiki/Tribe-Infecting_Virus) | 0 | `3` | 0 |  |
| [Mind Master](https://yugioh.fandom.com/wiki/Mind_Master) | 1 | `3` | 0 | ⬇️ |
| [Allure of Darkness](https://yugioh.fandom.com/wiki/Allure_of_Darkness) | 1 | `3` | 1 |  |
| [Left Arm of the Forbidden One](https://yugioh.fandom.com/wiki/Left_Arm_of_the_Forbidden_One) | 1 | `3` | 1 |  |
| [Left Leg of the Forbidden One](https://yugioh.fandom.com/wiki/Left_Leg_of_the_Forbidden_One) | 1 | `3` | 1 |  |
| [Monster Gate](https://yugioh.fandom.com/wiki/Monster_Gate) | 1 | `3` | 1 |  |
| [Night Assailant](https://yugioh.fandom.com/wiki/Night_Assailant) | 1 | `3` | 1 | ⬇️ |
| [Right Arm of the Forbidden One](https://yugioh.fandom.com/wiki/Right_Arm_of_the_Forbidden_One) | 1 | `3` | 1 |  |
| [Right Leg of the Forbidden One](https://yugioh.fandom.com/wiki/Right_Leg_of_the_Forbidden_One) | 1 | `3` | 1 |  |
| [The Transmigration Prophecy](https://yugioh.fandom.com/wiki/The_Transmigration_Prophecy) | 1 | `3` | 1 |  |
| [Destiny Draw](https://yugioh.fandom.com/wiki/Destiny_Draw) | 1 | `3` | 2 |  |
| [Summoner Monk](https://yugioh.fandom.com/wiki/Summoner_Monk) | 1 | `3` | 2 |  |
| [Tragoedia](https://yugioh.fandom.com/wiki/Tragoedia) | 1 | `3` | 2 |  |
| [Debris Dragon](https://yugioh.fandom.com/wiki/Debris_Dragon) | 2 | `3` | 1 |  |
| [Lonefire Blossom](https://yugioh.fandom.com/wiki/Lonefire_Blossom) | 2 | `3` | 1 |  |
| [Card Trooper](https://yugioh.fandom.com/wiki/Card_Trooper) | 2 | `3` | 2 |  |
| [Magical Stone Excavation](https://yugioh.fandom.com/wiki/Magical_Stone_Excavation) | 2 | `3` | 2 |  |
| [Judgment Dragon](https://yugioh.fandom.com/wiki/Judgment_Dragon) | 2 | `3` | 3 |  |
| [Overload Fusion](https://yugioh.fandom.com/wiki/Overload_Fusion) | 2 | `3` | 3 |  |
| [Spirit Reaper](https://yugioh.fandom.com/wiki/Spirit_Reaper) | 2 | `3` | 3 |  |
| [Dewloren, Tiger King of the Ice Barrier](https://yugioh.fandom.com/wiki/Dewloren,_Tiger_King_of_the_Ice_Barrier) | 3 | `3` | 2 |  |

</details>

<details>
<summary><strong><big>Development workflow</big></strong></summary>

Custom format data is built from immutable baseline files rather than edited
directly in EDOPro's active files. This makes card-pool and errata changes
reviewable in Git through the build scripts that apply them.

Development requires [Node.js LTS 22](https://nodejs.org/).

The Redux folders have these roles:

- `Redux\vanilla`: original baseline inputs, including the list and card
  databases required by selected pre-errata cards. Do not edit these after they
  have been captured.
- `Redux\scripts`: readable build and transformation scripts. Implement format
  changes here. EDOPro also reads Lua card overrides from
  `Redux\scripts\card-scripts`.
- `Redux\assets\pics`: tracked source folder for Redux card-image overrides.
- `Redux\modded`: generated database and LF-list files. Do not edit these
  directly.

Run the build from the repository root with Node.js:

```powershell
node .\Redux\scripts\build.js
```

The build recreates `Redux\modded`, copies the vanilla inputs, and applies any
declared transformations. EDOPro reads Redux paths through `config\configs.json`;
the local `Redux-11` entry is readable but not auto-updated.

The LF list is both the forbidden / limited list and the format card pool.
Its selected passcodes are intentional, including pre-errata card versions.
Project guidance and implementation rules can be found in `AGENTS.md`.

</details>

<details>
<summary><strong><big>Project Ignis: EDOPro Original README</big></strong></summary>

All assets for the game, except card images. See LICENSE and COPYING in each folder for proper credits, copyright, and rules for redistribution.
On Windows, please do not put your game install in Program Files, Downloads, or any other location that might be read-only or require admin permissions.
On Linux, after moving the game install to your preferred location, you can run `./install.sh` from a terminal to install desktop files for the current user.

<details>
<summary>System requirements</summary>

Supported platforms:

- Windows XP Service Pack 3 or later, 32-bit or 64-bit
- macOS 10.9 or later
- 64-bit/AArch64 GNU/Linux with glibc 2.27+ (e.g. Debian 10+, Ubuntu 18.04+, Fedora, CentOS 8+, rolling release distros like Arch)

1 GB free disk space recommended for asset updates and images.

1 GB free RAM recommended, though the game is not expected to exceed 300 MB of memory during normal usage.

### Prerequisites for WindBot Ignite (AI):

- Windows: install .NET Framework 4 if you don't have it. This ships with Windows 10.
- Linux: install the mono-complete package https://www.mono-project.com/download/stable/#download-lin
- macOS: install Mono with the .pkg https://www.mono-project.com/download/stable/#download-mac

</details>

<details>
<summary>Keyboard and mouse shortcuts</summary>

### General:

- ESC: Minimizes the window if not typing
- F9: Toggle topdown field view
- F10: Mac and Windows: Save the current window position (shift+F10 to restore it)
- F11: Toggles fullscreen
- F12: Captures a screenshot
- CTRL+O: Opens the additional settings window
- R: Reloads fonts if not typing
- CTRL+R: Reloads current skin
- CTRL+1: Switch to card info tab
- CTRL+2: Switch to duel log tab
- CTRL+3: Switch to chat log tab
- CTRL+4: Switch to settings tab
- CTRL+5: Switch to repositories tab
- Drag and drop support for files and text:
  - drop an `ydk` file in the main menu or the deck edit area to load that deck
  - drop a card passcode or card name in the deck edit area to add that card to the deck
  - drop a `ydke://` URL in the deck edit area to load the deck specified by that URL
  - drop a `yrpX` file in the main menu or the replay selection menu to load that replay, if valid
  - drop a Lua file in the main menu or the puzzle selection menu to load that puzzle, if valid
  - drop text in a text box to insert text
  - drop a `.pem`, `.cer`, `.crt` certificate bundle file to make the client use that for ssl verification (if you're getting ssl certificate is invalid)

### Deck editor:

- Right Mouse Button: Adds/removes a card from the deck
- Middle Mouse Button: Adds another copy of a card to the deck or side deck
- Shift+Right Mouse Button or Hold Left Mouse Button then click Right Mouse Button: Adds a card to the side deck
- With the exception of Shift+Right Mouse Button, holding Shift will ignore ALL deck building rules

While not typing:

- CTRL+C: Copies a `ydke://` URL of the deck list for sharing
- CTRL+SHIFT+C: Copies a plain text deck list for sharing
- CTRL+V: Imports a `ydke://` URL decklist from the clipboard

### Duel:

- Hold A or Hold Left Mouse Button: Lets the system stop at every timing.
- Hold S or Hold Right Mouse Button: Lets the system skip every timing.
- Hold D: Lets the system stop at available timing.
- F1 to F4: Shows the cards in your GY, banished, Extra Deck, Xyz Materials respectively.
- F5 to F8: Shows the cards in your opponent's GY, banished, Extra Deck, Xyz Materials respectively.
- Double click (or tap) on a card pile: Shows the cards in such pile.
- Use the Tab key to navigate between options in dialogue boxes, and press Space to select an option.

### macOS:

Note that system hotkeys may intercept some of the above keyboard shortcuts.
The following app shortcuts are also available in the app and dock menus:

- Cmd+N opens a new instance with audio muted
- Cmd+Q quits the game
- Ctrl+Cmd+F toggles fullscreen

</details>

<details>
<summary>Deck editor search functions</summary>

- `string`:
  returns all cards that have `string` in their name OR in the card text.
  Example: `Hero`
- `@string`
  returns all cards that belong to the `string` archetype. If no string is provided, returns all cards that are part of any archetype.
  Example: `@Hero`
- `$string`
  returns all cards that have `string` in their name only, which ignores the card text.
  Example: `$Heroic`
- `!!string`:
  negative lookup (NOT)
- `string1*string2`
  replaces any character in any amount. Example: `Eyes*Dragon` will return cards Blue-Eyes White Dragon, Red-Eyes B. Dragon, Galaxy-Eyes Photon Dragon, etc.
- `string1||string2`
  returns all cards that have `string1` OR `string2` in their name/text. Any of the strings can have any of the modifiers above.
  Example: `Trickstar||Bounzer`
- `string1`&&`string2`
  returns all cards that match `string1` and `string2`. Any of the strings can have any of the modifiers above.

These can be combined. Example: `@blue-eyes||$eyes of blue` returns all cards that belong to either the `Blue-Eyes` archetype or have `Eyes of Blue` in their names.

The ATK, DEF, Level/Rank, and Scale textboxes support searching for `?`. You can also prefix the search with comparison modifiers <, <=, >=, >, and =.

</details>

<details>
<summary>Test hand</summary>

A Hand Test mode is accessible from the deck editor, with quick restart.
The duel will **never** end normally in this game mode (e.g. running out of LP, decking out)

- Notice that this mode was not made to control the opponent. Dueling vs yourself in LAN Mode would be a better option for that.

</details>

<details>
<summary>Discord Rich Presence</summary>

Works with the desktop version of Discord. In your Discord settings, turn on Game Activity first.

Your status on Discord will update to be playing a game, including elapsed time.
Activities displayed in Rich Presence:

- Dueling
- In menu
- Playing a puzzle
- Watching a replay
- Editing a deck

### Game invites

Host a room on a server (LAN does not work). In the appropriate channel or private message, the upload (+) icon should change to have an additional green play button.
Clicking on it will send out a game invite to your room with your message of choice. If the room is locked, the password will be skipped for invitees.
Users can accept the invite while EDOPro is closed if they've started it once before; the game should be launched automatically. Note that Discord is rather fickle and changes this behaviour on us very frequently, so if the game fails to automatically launch, try starting the game.

</details>

<details>
<summary>Customization</summary>

### Default textures:

See README in `textures`.

### Skins:

Editable by adding subfolders to **skin**. For each folder, provide a unique `skin.xml` file, with the changes you want.
You can switch skins in the settings (CTRL+O). For instructions on the supported fields and what they change, see README in `skin`.

### Audio:

See README in `sound`. There are many new features, including summon chants!
Music and sound volume controls are also separated.

### MSAA (antialiasing)

Makes sharp/pixelated edges softer, but requires more performance.
2D elements might look blurred at higher levels. Rendering results are hardware- and device-dependent.
The program will automatically try smaller MSAA values if the driver does not support the specified MSAA level.

</details>

<details>
<summary>Advanced configuration</summary>

### system.conf

`config/system.conf` handles most of the configurations available in the game. It is overwritten when the game is closed normally.
Only options not directly configurable in-game are listed here.
Configurations listed as "boolean" accept either 0 for 'disabled' or 1 for 'enabled'.

<!-- prettier-ignore -->
| Name | Purpose | Example |
| --- | --- | --- |
| driver_type | graphic driver used for rendering. Valid values are: opengl, d3d9, d3d9on12, ogles1, ogles2, default. The availability of those values is listed in the table below. | |
| useWayland | Linux only. 1 = use experimental wayland device; 0 = use x11 device. | |
| textfont | path to the font used for texts and its size | fonts/NotoSansJP-Regular.otf 12 |
| numfont | path to the font used for numbers | fonts/NotoSansJP-Regular.otf |
| fallbackFonts | path to the fonts to be used as fallback for missing characters (each font and its **must** be contained in double quotes `"`, the game ships with a `bundled` font that will always be loaded) | "fonts/fallback1.otf 15" "bundled 12" |

If a character cannot be found in the supplied font, it will not be displayed. The shipped font supports all characters that appear on Yu-Gi-Oh! cards in Latin alphabets and Japanese.

### supported values for driver_type based on the system

<!-- prettier-ignore -->
| | opengl | d3d9 | d3d9on12 | ogles1 | ogles2 | default |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| Windows | X | X | X (If supported by the driver) | X (If supported by the driver) | X (If supported by the driver) | d3d9 |
| Linux Wayland | X (Only if LibGLx is present) | | | X (only if libGLESv1_CM is present) | X | ogles2 |
| Linux X11 | X | | | X (only if libGLESv1_CM is present) | X (only if libGLESv2 is present) | opengl |
| MacOS | X | | | | | opengl |
| Android | | | | X | X | ogles2 |

### configs.json

`config/configs.json` handles the servers the client is connected to, which include repositories for updates, servers for duels and pictures.

#### repos (array)

- url: required, the complete url of the repository to check for updates.
- repo_path: optional, the subdirectory in the client's directory where the contents will be saved. If not provided, the folder will be created in the expansions folder and will have the repository's name.
- has_core: boolean, optional (defaults to false).
- core_path: optional, used if has_core is true.
- data_path: optional, the folder where the databases and the strings will be loaded from in the repository. If not provided, it will load from the main folder of the repository.
- script_path: optional, the folder where the scripts will be loaded from in the repository. If not provided, it will load from the script folder of the repository. If an `init.lua` script is present in this folder, it will automatically loaded after the main utility scripts.
- pics_path: optional, the folder where the pics will be loaded from in the repository. If not provided, it will load from the pics folder of the repository.
- lflist_path: optional, the path for lflists, if the repository contains any.
- should_update: boolean, optional (defaults to true), if the client will download the contents of the repository. If the repository is missing, it will still be downloaded only for the first time. If not provided, it will be set to true.
- should_read: boolean, optional (defaults to true), if set to false the game will ignore that repository. If not provided, it will be set to true.
- is_language: boolean, optional (defaults to false), if set to true, declares that the current repository is a languages repository, which can be used to enable translations
- language: optional, a string with the name of the language, if is_language is used.
- not_git_repo: boolean, optional (defaults to false), if set to true, the entry will be considered as a local folder, in which case the url parameter is not needed.

#### urls (array)

- url: A URL format string for direct card image download, or "default". Should contain `{}` to be replaced by the client with the card's passcode.
- type: pic/field/cover

#### servers (array)

- name: Display name
- address: URL (domain or IP works) for connecting to rooms nad hosting
- duelport: port for the above
- roomaddress: URL for retrieving the room list via the REST API
- roomlistprotocol: url protocol that will be used for roomaddress. Supported protocols are `http` (default if not provided) and `https`
- roomlistport: port for the above

#### posixPathExtension

Used on macOS and Linux as additional search paths for Mono, required to run WindBot Ignite. Generally you should not need to change this.

</details>

</details>

<details>
<summary><strong><big>Copyright notice and license</big></strong></summary>

Copyright (C) 2020 Project Ignis contributors. See version history and author credit line for each file.

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

</details>
