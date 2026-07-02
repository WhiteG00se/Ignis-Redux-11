--Alien Warrior (Redux-11 errata)
local s,id=GetID()
function s.initial_effect(c)
	--Place 2 A-Counters on face-up cards on the field
	local e1=Effect.CreateEffect(c)
	e1:SetDescription(aux.Stringid(id,0))
	e1:SetCategory(CATEGORY_COUNTER)
	e1:SetType(EFFECT_TYPE_SINGLE+EFFECT_TYPE_TRIGGER_O)
	e1:SetProperty(EFFECT_FLAG_DAMAGE_STEP+EFFECT_FLAG_DELAY)
	e1:SetCode(EVENT_DESTROYED)
	e1:SetTarget(s.cttarget)
	e1:SetOperation(s.ctoperation)
	c:RegisterEffect(e1)
	--atk def
	local e2=Effect.CreateEffect(c)
	e2:SetType(EFFECT_TYPE_FIELD)
	e2:SetCode(EFFECT_UPDATE_ATTACK)
	e2:SetRange(LOCATION_MZONE)
	e2:SetTargetRange(LOCATION_MZONE,LOCATION_MZONE)
	e2:SetCondition(s.adcon)
	e2:SetTarget(s.adtg)
	e2:SetValue(s.adval)
	c:RegisterEffect(e2)
	local e3=e2:Clone()
	e3:SetCode(EFFECT_UPDATE_DEFENSE)
	c:RegisterEffect(e3)
end
s.listed_series={SET_ALIEN}
s.counter_place_list={COUNTER_A}
function s.ctfilter(c)
	return c:IsFaceup() and c:IsCanAddCounter(COUNTER_A,1)
end
function s.cttarget(e,tp,eg,ep,ev,re,r,rp,chk)
	if chk==0 then return Duel.IsExistingMatchingCard(s.ctfilter,tp,LOCATION_ONFIELD,LOCATION_ONFIELD,1,nil) end
	Duel.SetOperationInfo(0,CATEGORY_COUNTER,nil,2,0,COUNTER_A)
end
function s.ctoperation(e,tp,eg,ep,ev,re,r,rp)
	for i=1,2 do
		local g=Duel.GetMatchingGroup(s.ctfilter,tp,LOCATION_ONFIELD,LOCATION_ONFIELD,nil)
		if #g==0 then break end
		Duel.Hint(HINT_SELECTMSG,tp,HINTMSG_COUNTER)
		local sg=g:Select(tp,1,1,nil)
		sg:GetFirst():AddCounter(COUNTER_A,1)
	end
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
