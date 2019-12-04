import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
	SlidesWrapper,
	Slider,
	MySlide,
	Arrow
 } from './style';
 import  { actionCreator } from './store';

const Slides = (props) => {
	const children = props.children;
	const sum = children.length;

	const sliderLeft = useSelector(state => state.sliderLeft);	
	const dragging = useSelector(state => state.dragging);	
	const animationStart = useSelector(state => state.animationStart);	
	const startAt = useSelector(state => state.startAt);	
	const stopAt = useSelector(state => state.stopAt);	
	const pause = useSelector(state => state.pause);	

	const dispatch = useDispatch();

	//在Slider上点击表示拖拽开始，任意位置松开鼠标拖拽结束
	const dragStart = useCallback(
    (event) => {
    	const clientX = event.clientX;   
    	const currentLeft = event.currentTarget.getBoundingClientRect().left; 
    	dispatch(actionCreator.dragStart(clientX, currentLeft));
    	}, [dispatch]
  );
	const dragEnd = useCallback(
    (event) => dispatch(actionCreator.dragEnd()),
    [dispatch]
  );

	//鼠标移动到组件外部松开也可以正常计算移动距离，要在window上监听松开鼠标事件
  useEffect(() => {  	
    window.addEventListener('mouseup', dragEnd);
    return () => {
    	window.removeEventListener('mouseup', dragEnd)
    }
  }, [dragEnd]);

	//初始化，将图片队列向左移动一个图片的长度，记录图片数
  const mySliderRef = useRef();
  useEffect(() => {  	
    dispatch(actionCreator.init(mySliderRef.current.clientWidth, sum, mySliderRef.current.getBoundingClientRect().left))
  }, [dispatch, sum]);


	//鼠标移动时拖动图片队列
	const handleMouseMove = useCallback((event) => {
		if (dragging) {
			dispatch(actionCreator.mouseMove(event.clientX))
		}
	}, [dispatch, dragging]);
	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
		}
	},[handleMouseMove])

	//动画结束
	const handleAnimationEnd = useCallback(
		() => dispatch(actionCreator.animationEnd()), [dispatch]
	)

	//点击左右箭头按钮切换
	const handleClickArrow = useCallback(
	(button) => {
		return () => dispatch(actionCreator.clickButton(button))
	}, [dispatch]);

	return (
		<SlidesWrapper 
			minWidth={props.minWidth}
			dragging={dragging}
		>
			<Slider 
			sum={sum}
			left={sliderLeft}
			onMouseDown={dragStart}
			onAnimationEnd={handleAnimationEnd}
			animationStart={animationStart}
			startAt={startAt}
			stopAt={stopAt}
			pause={pause}
			>
				<MySlide sum={sum} ref={mySliderRef}>{children[sum - 1]}</MySlide>
				{React.Children.map(children, (child) => {
					return (<MySlide sum={sum}>{child}</MySlide>)
				})}
				<MySlide sum={sum}>{children[0]}</MySlide>
			</Slider>
			<Arrow onClick={handleClickArrow("LEFT")}>&#10094;</Arrow>
			<Arrow className="right" onClick={handleClickArrow("RIGHT")}>&#10095;</Arrow>
		</SlidesWrapper>
	)
}

export { Slides };