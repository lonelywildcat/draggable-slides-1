import produce from "immer";

const iniState = {
	sliderLeft: 0,
	sliderWidth: 0,
	dragStartClientX: 0,
	dragEndClientX:0,
	dragDistance: 0,
	dragging: false,
	draggingClientX: 0,
	draggingStartX: 0,
	animationStart: false,
	startAt: 0,
	stopAt: 0,
	totalPic: 0,
	clickOnAnim: false,
	pause: false,
	currentBoxLeft: 0,
	initBoxLeft: 0,
	dragStartTime: 0,
	dragTime: 0,
	button: ''
}

const calDragStopAt = (startPoint, dragDistance, sliderWidth, dragTime) => {
	if ( dragTime < 300 && dragDistance > 0) {
		return startPoint + Math.ceil(dragDistance / sliderWidth) * sliderWidth
	} 
	if ( dragTime < 300 && dragDistance < 0) {
		return startPoint + Math.floor(dragDistance / sliderWidth) * sliderWidth
	} 
	return startPoint + Math.round(dragDistance / sliderWidth) * sliderWidth 	
}

const jumpTo = (currentAt, sliderWidth, total) => {
	if( currentAt === 0) {
			return -sliderWidth * total
	}
	if (currentAt === -sliderWidth * (total + 1)){
			return -sliderWidth
	}
	return currentAt
}

const calClickStopAt = (button, startPoint, width, total) => {
	let slideTo;
	if (button === 'LEFT') {
		slideTo = startPoint + width;
	}
	if (button === 'RIGHT') {
		slideTo = startPoint - width
	}	
	return slideTo
};

const calDragDistance = (start, stop , width) => {
	let distance = stop - start;
	if (Math.abs(distance) > 1.49 * width) {
		distance = 1.49 * width
	}
	return distance
};

const reducer = (state = iniState, action) => {	
	switch (action.type) {
		case "DRAG_START":				
			return produce( state, draft => {						
					draft.dragStartClientX =  action.clientX;
					draft.currentBoxLeft = action.currentBoxLeft;
					draft.clickOnAnim = draft.animationStart ? true : false;
					draft.dragging = draft.clickOnAnim ? false : true;
					draft.draggingStartX = state.sliderLeft;						
					draft.pause =  true ;		
					draft.dragStartTime = new Date();							 
				})
		case "DRAG_END":
			return produce( state, draft => {	
					if(state.dragging) {
						draft.dragging = false;
						draft.animationStart = true;
						draft.dragTime = new Date() - state.dragStartTime;
						draft.startAt = state.sliderLeft;
						draft.stopAt = calDragStopAt(state.draggingStartX, state.dragDistance, state.sliderWidth, draft.dragTime);
					}
					draft.pause = false;					 
				})
		case "INIT":
			return produce( state, draft => {
					draft.sliderLeft = -action.width;		
					draft.sliderWidth = action.width;	
					draft.totalPic = action.sum;
					draft.initBoxLeft= action.initBoxLeft - action.width;
				})
		case "MOUSE_MOVE":			
			return produce( state, draft => {					
					draft.draggingClientX = action.clientX;	
					draft.dragDistance = calDragDistance(state.dragStartClientX, draft.draggingClientX, state.sliderWidth) ;			
					draft.sliderLeft = state.draggingStartX + draft.dragDistance; 					
				})
		case "ANIMATION_END":
			return produce( state, draft => {					
					draft.animationStart = false;
					draft.sliderLeft = jumpTo(state.stopAt, state.sliderWidth, state.totalPic);
					draft.dragDistance = 0;						
				})
		case "CLICK_BUTTON":
			return produce( state, draft => {					
					draft.button = 	action.button;	
					draft.animationStart = true;
					draft.startAt = state.sliderLeft;	
					draft.stopAt = calClickStopAt(action.button, state.sliderLeft, state.sliderWidth, state.totalPic);
				})
		default:
			return state;
	}
}

export { reducer } ;