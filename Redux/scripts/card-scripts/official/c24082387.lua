--Alien Crop Circles (Redux-11 errata)
local s,id=GetID()
local REDUX_ALIEN_GY_EFFECT=62437709
function s.initial_effect(c)
	--Flip all cards that can be flipped face-down
	local e1=Effect.CreateEffect(c)
	e1:SetCategory(CATEGORY_POSITION)
	e1:SetType(EFFECT_TYPE_ACTIVATE)
	e1:SetCode(EVENT_FREE_CHAIN)
	e1:SetHintTiming(0,TIMING_END_PHASE)
	e1:SetCondition(s.condition)
	e1:SetTarget(s.target)
	e1:SetOperation(s.activate)
	c:RegisterEffect(e1)
	--Add 1 "Alien" card from your Deck to your hand
	local e2=Effect.CreateEffect(c)
	e2:SetDescription(aux.Stringid(id,1))
	e2:SetCategory(CATEGORY_TOHAND+CATEGORY_SEARCH)
	e2:SetType(EFFECT_TYPE_IGNITION)
	e2:SetRange(LOCATION_GRAVE)
	e2:SetCountLimit(1,REDUX_ALIEN_GY_EFFECT)
	e2:SetCost(aux.bfgcost)
	e2:SetTarget(s.thtarget)
	e2:SetOperation(s.thoperation)
	c:RegisterEffect(e2)
end
s.listed_series={SET_ALIEN}
s.counter_list={COUNTER_A}
function s.condition(e,tp,eg,ep,ev,re,r,rp)
	return Duel.GetCounter(tp,LOCATION_ONFIELD,LOCATION_ONFIELD,COUNTER_A)>0
end
function s.posfilter(c)
	return c:IsFaceup() and c:IsCanTurnSet()
end
function s.target(e,tp,eg,ep,ev,re,r,rp,chk)
	if chk==0 then return true end
	local g=Duel.GetMatchingGroup(s.posfilter,tp,LOCATION_ONFIELD,LOCATION_ONFIELD,nil)
	Duel.SetOperationInfo(0,CATEGORY_POSITION,g,#g,0,POS_FACEDOWN)
end
function s.activate(e,tp,eg,ep,ev,re,r,rp)
	local mg=Duel.GetMatchingGroup(s.posfilter,tp,LOCATION_MZONE,LOCATION_MZONE,nil)
	if #mg>0 then
		Duel.ChangePosition(mg,POS_FACEDOWN_DEFENSE)
	end
	local sg=Duel.GetMatchingGroup(s.posfilter,tp,LOCATION_SZONE|LOCATION_FZONE,LOCATION_SZONE|LOCATION_FZONE,nil)
	if #sg>0 then
		Duel.ChangePosition(sg,POS_FACEDOWN)
	end
end
function s.thfilter(c)
	return c:IsSetCard(SET_ALIEN) and c:IsAbleToHand()
end
function s.thtarget(e,tp,eg,ep,ev,re,r,rp,chk)
	if chk==0 then return Duel.IsExistingMatchingCard(s.thfilter,tp,LOCATION_DECK,0,1,nil) end
	Duel.SetOperationInfo(0,CATEGORY_TOHAND,nil,1,tp,LOCATION_DECK)
end
function s.thoperation(e,tp,eg,ep,ev,re,r,rp)
	Duel.Hint(HINT_SELECTMSG,tp,HINTMSG_ATOHAND)
	local g=Duel.SelectMatchingCard(tp,s.thfilter,tp,LOCATION_DECK,0,1,1,nil)
	if #g>0 then
		Duel.SendtoHand(g,nil,REASON_EFFECT)
		Duel.ConfirmCards(1-tp,g)
	end
end
