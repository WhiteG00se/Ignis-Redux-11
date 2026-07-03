--Alien Mother (Redux-11 errata)
local s,id=GetID()
function s.initial_effect(c)
	c:SetUniqueOnField(1,0,aux.FilterBoolFunction(s.highalien),LOCATION_MZONE)
	--Special Summon this card from your hand or GY
	local e0=Effect.CreateEffect(c)
	e0:SetDescription(aux.Stringid(id,0))
	e0:SetCategory(CATEGORY_SPECIAL_SUMMON)
	e0:SetType(EFFECT_TYPE_IGNITION)
	e0:SetRange(LOCATION_HAND|LOCATION_GRAVE)
	e0:SetCondition(s.hspcon)
	e0:SetCost(s.hspcost)
	e0:SetTarget(s.hsptg)
	e0:SetOperation(s.hspop)
	c:RegisterEffect(e0)
	--Check
	local e1=Effect.CreateEffect(c)
	e1:SetType(EFFECT_TYPE_SINGLE+EFFECT_TYPE_CONTINUOUS)
	e1:SetProperty(EFFECT_FLAG_CANNOT_DISABLE)
	e1:SetCode(EVENT_BATTLED)
	e1:SetOperation(s.checkop)
	c:RegisterEffect(e1)
	local g=Group.CreateGroup()
	e1:SetLabelObject(g)
	g:KeepAlive()
	--Register monster destroyed by battle
	local e2=Effect.CreateEffect(c)
	e2:SetType(EFFECT_TYPE_SINGLE+EFFECT_TYPE_CONTINUOUS)
	e2:SetProperty(EFFECT_FLAG_CANNOT_DISABLE)
	e2:SetCode(EVENT_BATTLE_DESTROYING)
	e2:SetOperation(s.checkop2)
	e2:SetLabelObject(e1)
	c:RegisterEffect(e2)
	--Special Summon the destroyed monster
	local e3=Effect.CreateEffect(c)
	e3:SetDescription(aux.Stringid(id,1))
	e3:SetCategory(CATEGORY_SPECIAL_SUMMON)
	e3:SetType(EFFECT_TYPE_FIELD+EFFECT_TYPE_TRIGGER_F)
	e3:SetCode(EVENT_PHASE|PHASE_BATTLE)
	e3:SetRange(LOCATION_MZONE)
	e3:SetCountLimit(1)
	e3:SetCondition(s.spcon)
	e3:SetTarget(s.sptg)
	e3:SetOperation(s.spop)
	e3:SetLabelObject(e2)
	c:RegisterEffect(e3)
	--Attack limit
	local e4=Effect.CreateEffect(c)
	e4:SetType(EFFECT_TYPE_FIELD)
	e4:SetCode(EFFECT_CANNOT_SELECT_BATTLE_TARGET)
	e4:SetRange(LOCATION_MZONE)
	e4:SetTargetRange(0,LOCATION_MZONE)
	e4:SetValue(s.atlimit)
	c:RegisterEffect(e4)
	--Destroy monsters summoned by this card
	local e5=Effect.CreateEffect(c)
	e5:SetType(EFFECT_TYPE_SINGLE+EFFECT_TYPE_CONTINUOUS)
	e5:SetCode(EVENT_LEAVE_FIELD)
	e5:SetOperation(s.desop)
	c:RegisterEffect(e5)
	--ATK/DEF loss for monsters with A-Counters battling "Alien" monsters
	local e6=Effect.CreateEffect(c)
	e6:SetType(EFFECT_TYPE_FIELD)
	e6:SetCode(EFFECT_UPDATE_ATTACK)
	e6:SetRange(LOCATION_MZONE)
	e6:SetTargetRange(LOCATION_MZONE,LOCATION_MZONE)
	e6:SetCondition(s.adcon)
	e6:SetTarget(s.adtg)
	e6:SetValue(s.adval)
	c:RegisterEffect(e6)
	local e7=e6:Clone()
	e7:SetCode(EFFECT_UPDATE_DEFENSE)
	c:RegisterEffect(e7)
end
s.listed_series={SET_ALIEN}
s.counter_list={COUNTER_A}
function s.highalien(c)
	return c:IsFaceup() and c:IsMonster() and c:IsSetCard(SET_ALIEN) and c:IsLevelAbove(6)
end
function s.hspcon(e,tp,eg,ep,ev,re,r,rp)
	return Duel.GetCounter(tp,LOCATION_ONFIELD,LOCATION_ONFIELD,COUNTER_A)>=5
		and not Duel.IsExistingMatchingCard(s.highalien,tp,LOCATION_MZONE,0,1,e:GetHandler())
end
function s.hspcost(e,tp,eg,ep,ev,re,r,rp,chk)
	if chk==0 then return Duel.IsCanRemoveCounter(tp,1,1,COUNTER_A,2,REASON_COST) end
	Duel.RemoveCounter(tp,1,1,COUNTER_A,2,REASON_COST)
end
function s.hsptg(e,tp,eg,ep,ev,re,r,rp,chk)
	local c=e:GetHandler()
	if chk==0 then return Duel.GetLocationCount(tp,LOCATION_MZONE)>0
		and c:IsCanBeSpecialSummoned(e,0,tp,false,false) end
	Duel.SetOperationInfo(0,CATEGORY_SPECIAL_SUMMON,c,1,tp,c:GetLocation())
end
function s.hspop(e,tp,eg,ep,ev,re,r,rp)
	local c=e:GetHandler()
	if c:IsRelateToEffect(e) and Duel.GetLocationCount(tp,LOCATION_MZONE)>0 then
		Duel.SpecialSummon(c,0,tp,tp,false,false,POS_FACEUP)
	end
end
function s.checkop(e,tp,eg,ep,ev,re,r,rp)
	local c=e:GetHandler()
	local t=Duel.GetAttackTarget()
	if t and t~=c and t:GetCounter(COUNTER_A)>0 then
		e:SetLabel(1)
	else
		e:SetLabel(0)
	end
end
function s.checkop2(e,tp,eg,ep,ev,re,r,rp)
	local c=e:GetHandler()
	if e:GetLabelObject():GetLabel()==0 then return end
	local t=c:GetBattleTarget()
	if not t then return end
	local g=e:GetLabelObject():GetLabelObject()
	if c:GetFieldID()~=e:GetLabel() then
		g:Clear()
		e:SetLabel(c:GetFieldID())
	end
	g:AddCard(t)
	t:RegisterFlagEffect(id,RESET_PHASE|PHASE_BATTLE,0,1)
end
function s.spcon(e,tp,eg,ep,ev,re,r,rp)
	return e:GetHandler():GetFieldID()==e:GetLabelObject():GetLabel()
end
function s.filter(c,e,tp)
	return c:GetFlagEffect(id)~=0 and c:IsCanBeSpecialSummoned(e,0,tp,false,false)
end
function s.sptg(e,tp,eg,ep,ev,re,r,rp,chk)
	local g=e:GetLabelObject():GetLabelObject():GetLabelObject()
	if chk==0 then return g:IsExists(s.filter,1,nil,e,tp) end
	local dg=g:Filter(s.filter,nil,e,tp)
	g:Clear()
	Duel.SetTargetCard(dg)
	Duel.SetOperationInfo(0,CATEGORY_SPECIAL_SUMMON,dg,#dg,0,0)
end
function s.sfilter(c,e,tp)
	return c:IsRelateToEffect(e) and c:IsCanBeSpecialSummoned(e,0,tp,false,false)
end
function s.spop(e,tp,eg,ep,ev,re,r,rp)
	local ft=Duel.GetLocationCount(tp,LOCATION_MZONE)
	if ft<=0 then return end
	if Duel.IsPlayerAffectedByEffect(tp,CARD_BLUEEYES_SPIRIT) then ft=1 end
	local g=Duel.GetChainInfo(0,CHAININFO_TARGET_CARDS)
	local sg=g:Filter(s.sfilter,nil,e,tp)
	Duel.Hint(HINT_SELECTMSG,tp,HINTMSG_SPSUMMON)
	if #sg>ft then sg=sg:Select(tp,ft,ft,nil) end
	local c=e:GetHandler()
	for tc in aux.Next(sg) do
		Duel.SpecialSummonStep(tc,0,tp,tp,false,false,POS_FACEUP)
		tc:RegisterFlagEffect(id,RESET_EVENT|RESETS_STANDARD,0,0)
		c:CreateRelation(tc,RESET_EVENT|RESET_TURN_SET|RESET_TOFIELD)
	end
	Duel.SpecialSummonComplete()
end
function s.desfilter(c,rc)
	return c:GetFlagEffect(id)~=0 and rc:IsRelateToCard(c)
end
function s.atlimit(e,c)
	local rc=e:GetHandler()
	return c==rc and Duel.IsExistingMatchingCard(s.desfilter,rc:GetControler(),LOCATION_MZONE,0,1,c,rc)
end
function s.desop(e,tp,eg,ep,ev,re,r,rp)
	local dg=Duel.GetMatchingGroup(s.desfilter,tp,LOCATION_MZONE,0,nil,e:GetHandler())
	Duel.Destroy(dg,REASON_EFFECT)
end
function s.adcon(e)
	return Duel.IsPhase(PHASE_DAMAGE_CAL) and Duel.GetAttackTarget()
end
function s.adtg(e,c)
	local bc=c:GetBattleTarget()
	return bc and c:GetCounter(COUNTER_A)~=0 and bc:IsSetCard(SET_ALIEN)
end
function s.adval(e,c)
	return c:GetCounter(COUNTER_A)*-300
end
