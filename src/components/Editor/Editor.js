import React from 'react';
import css from './Editor.css';
import { MarkDownEditor, getContent } from './markdown/markdown';
import { Select } from  'antd';
const Option = Select.Option;
const children = [];
const tagArr = ['Javascript','PHP','NodeJs','Vue','React'];
for (let i = 0; i < tagArr.length; i++) {
	children.push(<Option key={i} value={tagArr[i]}>{tagArr[i]}</Option>);
}

class Editor extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			title:'dfdf',//文章标题
			tags: [],//文章标签
		}
	}
	submit (e) {
		let content = getContent();//文本框内容
		let obj = new Object();
		obj.content = content;
		obj.title = this.state.title;
		obj.tags = this.state.tags;
		console.log(obj);
	}
	inputChangeHandler (e) {
		let val = e.target.value;
		console.log(e.target);
		this.setState({
			title: val
		})
	}
	tagChangeHandler (e) {
		this.setState({
			tags: e,
		})
	}
	render(){

		return (
			<div className={css.editor}>
				<h2 className={css.title}>写文章</h2>
				<div className={css["editor-title"]}>
					<input className={css.textbox} type='text' value={this.state.title} placeholder="来，取个响亮的标题吧！" onChange={(e)=>{this.inputChangeHandler(e)}} />
				</div>
				<div className={css.tagBox}>
					<Select mode="tags" value={this.state.tags} style={{ width: '100%' }} size="large" placeholder="例如JavaScript" onChange={(e)=>{this.tagChangeHandler(e)}}>
						{children}
					</Select>
				</div>
				<div className={css["markdown-editor"]}>
					<MarkDownEditor />
				</div>
				<div className={css.footer}>
					<button onClick={(e)=>{this.submit(e)}}>提交</button>
				</div>
			</div>
		)
	}

}
export default Editor;