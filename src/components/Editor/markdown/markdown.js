import React from 'react';
import marked from 'marked';
import css from './markdown.css';
import $ from 'jquery';

var content;//用来保存文章内容
//获取编辑器内容，并暴露出去
export function getContent(){
	return content;
}
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});
export class MarkDownEditor extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isFullScreen: false,//是否全屏
			mode: 'split',//模式（分屏、预览、编辑）
			helpModalHidden: true,//是否隐藏帮助模态框
			uploadModalHidden: true,//是否隐藏图片上传模态框
			picModal: 'net',//图片上传模式（线上图片，本地图片）
			result: marked(this.props.content || '')
		}
	}
	componentDidMount () {
		var that = this;
		this.textControl = this.refs.editor;
    	this.previewControl = this.refs.preview;

		//滚动跟随
		this.textControl.onscroll = function (e) {
			var height1 = this.scrollHeight - that.refs.editor.clientHeight;
			var height2 = that.refs.preview.scrollHeight - that.refs.editor.clientHeight;
			that.refs.preview.scrollTop = this.scrollTop*height2/height1;
		}	
		// 捕获键盘按键
		document.onkeydown =function(event){   
			var e = event || window.event || arguments.callee.caller.arguments[0];   
			if (e.keyCode == 66 && e.ctrlKey) {    
				//  ：Ctrl + B 文本加粗
				that._boldText();
			}else if (e.keyCode == 73 && e.ctrlKey) {
				// ：Ctrl + I 斜体
				that._italicText();
			}else if (e.keyCode == 81 && e.ctrlKey) {
				// ：Ctrl + Q 引用
				e.preventDefault();
				that._blockquoteText();
			}else if (e.keyCode == 76 && e.ctrlKey) {
				// ：Ctrl + L 插入链接
				e.preventDefault();
				that._linkText();
			}else if (e.keyCode == 75 && e.ctrlKey) {
				// ：Ctrl + K 插入代码
				e.preventDefault();
				that._codeText();
			}else if (e.keyCode == 71 && e.ctrlKey) {
				// ：Ctrl + G 插入图片
				e.preventDefault();
				that._pictureText();
			}else if (e.keyCode == 72 && e.ctrlKey) {
				// ：Ctrl + H 插入标题
				e.preventDefault();
				that._headerText();
			}else if (e.keyCode == 79 && e.ctrlKey) {
				// ：Ctrl + O 有序列表
				e.preventDefault();
				that._listOlText();
			}else if (e.keyCode == 85 && e.ctrlKey) {
				// ：Ctrl + U 无序列表
				e.preventDefault();
				that._listUlText();
			}else if (e.keyCode == 82 && e.ctrlKey) {
				// ：Ctrl + R 横线
				e.preventDefault();
				that._lineText();
			}else if (e.keyCode == 82 && e.ctrlKey) {
				// ：Ctrl + Y 重做
				e.preventDefault();
				that._clearAll();
			}else if (e.keyCode == 112 ) {
				e.preventDefault();
				that._toggleModal();
			}
		};    		
	}
	componentDidUpdate () {
		var that = this;
		setTimeout(function(){
			var height1 = that.refs.editor.scrollHeight;
			var height2 = that.refs.preview.scrollHeight;
			that.refs.preview.scrollTop = that.refs.editor.scrollTop*height2/height1;
		},100)
	}
	componentWillUnmount () {
		this.textControl = null
		this.previewControl = null		
	}
	//是否显示帮助
	_toggleModal (e){
		this.setState({ helpModalHidden: !this.state.helpModalHidden });
	}
	//是否显示图片上传模态框
	_toggleUploadModal (e) {
		this.setState({ uploadModalHidden: !this.state.uploadModalHidden });
	}
	//全屏切换
	_toggleFullScreen (e) {
		this.setState({ isFullScreen: !this.state.isFullScreen });
	}
	//模式切换
	_changeModal(e,mode){
		this.setState({ mode:mode });
	}
	_onChange (e) {
		if (interval) clearTimeout(interval)
		var that = this;
		var value = e.target.value;
		content = value;
		var interval = setTimeout(function(){
			that.setState({ result: marked(value) });
		},300);
	}
	//输入处理器
	_preInputText (text, preStart, preEnd) {
		this.textControl.focus();//首先让输入域获取焦点才能选中文本
		const start = this.textControl.selectionStart;
		const end = this.textControl.selectionEnd;
		const origin = this.textControl.value;
		console.log(start,end);
		if (start !== end) {
			const exist = origin.slice(start, end);
			text = text.slice(0, preStart) + exist + text.slice(preEnd);
			preEnd = preStart + exist.length;
		}
		this.textControl.value = origin.slice(0, start) + text + origin.slice(end);
		this.textControl.setSelectionRange(start + preStart, start + preEnd);
		console.log(start + preStart, start + preEnd)
		this.setState({ result: marked(this.textControl.value) });
		content = this.textControl.value;

	}
	//文本加粗
	_boldText () {
		this._preInputText("**加粗文字**", 2, 6)
	}
	//斜体文字
	_italicText () {
		this._preInputText("_斜体文字_",1,5);
	}
	//链接
	_linkText () {
		this._preInputText("[链接文本](www.yourlink.com)",1,5);
	}
	//引用
	_blockquoteText () {
		this._preInputText("> 引用", 2, 4)
	}
	//代码段
	_codeText () {
		this._preInputText("\ncode block\n", 4, 14)
	}
	//图片
	_pictureText () {
		// this._preInputText("![alt](www.yourlink.com)", 2, 5);
		this._toggleUploadModal();
	}
	//插入线上图片
	_insertNetPic (e) {
		this.setState({ picModal: 'net' });
	}
	//上传本地图片
	_uploadLocalPic (e) {
		this.setState( { picModal: 'local' });
	}
	//无序列表
	_listUlText () {
		this._preInputText("- 无序列表项0\n- 无序列表项1", 2, 8)
	}
	//有序列表
	_listOlText () {
		this._preInputText("1. 有序列表项0\n2. 有序列表项1", 3, 9)
	}
	//标题
	_headerText () {
		this._preInputText("## 标题", 3, 5)
	}
	render(){
		return(
			<div className={this.state.isFullScreen==false?css.editor:(css.editor+' '+css.fullscreen)}>
				<div className={css.topBar}>
					<div className={css.toolbar}>
						<ul>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._boldText(e)}} title="加粗" className={css["icon-bold"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._italicText(e)}} title="斜体" className={css["icon-italic"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._linkText(e)}} title="链接" className={css["icon-link"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._blockquoteText(e)}} title="引用" className={css["icon-outdent"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._codeText(e)}} title="代码段" className={css["icon-code"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._pictureText(e)}} title="图片" className={css["icon-pic"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._listUlText(e)}} title="有序列表" className={css["icon-list-o"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._listOlText(e)}} title="无序列表" className={css["icon-list-u"]}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a onClick={(e)=>{this._headerText(e)}} title="标题" className={css["icon-title"]}></a>
							</li>
						</ul>
					</div>
					<div className={css.modebar}>
						<ul>
							<li className={css["tb-btn"]}>
								<a title="使用帮助" className={css["icon-help"]} onClick={(e)=>{this._toggleModal(e)}}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a title="全屏" className={css["icon-full-screen"]} onClick={(e)=>{this._toggleFullScreen(e)}}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a title="编辑模式" className={css["icon-write-mode"]} onClick={(e)=>{this._changeModal(e,'edit')}}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a title="分屏模式" className={css["icon-split-screen"]} onClick={(e)=>{this._changeModal(e,'split')}}></a>
							</li>
							<li className={css["tb-btn"]}>
								<a title="预览" className={css["icon-preview"]} onClick={(e)=>{this._changeModal(e,'preview')}}></a>
							</li>							
						</ul>
					</div>
				</div>	
				<div className={css["md-editor"]}>
					<div className={this.state.mode!='edit'?css["editor-erea"]:(css["editor-erea"]+' '+css.expand)}>
						<textarea ref="editor" name="content" onChange={(e)=>{this._onChange(e)}}></textarea>
					</div>
					<div ref="preview" dangerouslySetInnerHTML={{ __html: this.state.result }} className={this.state.mode=='edit'?(css.shrink+' '+css["editor-preview"]+' '+"markdown"):(this.state.mode=='preview'?(css["editor-preview"]+' '+css.expand+' '+"markdown"):css["editor-preview"]+' '+"markdown")}></div>
				</div>
				<div className={css.modal} style={this.state.helpModalHidden===true?{display:'none'}:{display:'block'}}>
					<div className={css.innerModal}>
						<div className={css.helpTitle}>快捷键帮助</div>
						<div className={css.helpInfo}>
							打开帮助文档: F1 <br />
							加粗：Ctrl + B <br />
							斜体：Ctrl + I <br />
							引用：Ctrl + Q <br />
							插入链接：Ctrl + L <br />
							插入代码：Ctrl + K <br />
							插入图片：Ctrl + G <br />
							提升标题：Ctrl + H <br />
							有序列表：Ctrl + O <br />
							无序列表：Ctrl + U <br />
							横线：Ctrl + R	
						</div>
						<button className={css.close} onClick={(e)=>{this._toggleModal(e)}}>关闭</button>					
					</div>
					
				</div>
				<div className={css.modal} style={this.state.uploadModalHidden===true?{display:'none'}:{display:'block'}}>
					<div className={css["modal-content"]}>
						<div className={css["modal-header"]}>
							<h4 className={css["modal-title"]}>插入图片</h4>
						</div>
						<div className={css["modal-body"]}>
							<ul className={css["nav-tabs"]}>
								<li className={this.state.picModal === 'net' ? css.active : ''} onClick={(e)=>{this._insertNetPic(e)}}>在线图片</li>
								<li className={this.state.picModal === 'local' ? css.active : ''} onClick={(e)=>{this._uploadLocalPic(e)}}>上传图片</li>
							</ul>
							<div className={css["tab-panel"]} style={this.state.picModal === 'net'?{display:'block'}:{display:'none'}}>
								<div className={css["input-group"]}>
									<span className={css["input-group-addon"]}>图片描述</span>
									<input className={css["input-group-input"]} placeholder="请输入图片的描述，在图片无法显示时，将显示该描述信息。"/>
								</div>
								<div className={css["input-group"]}>
									<span className={css["input-group-addon"]}>图片链接</span>
									<input className={css["input-group-input"]} placeholder="请输入图片的链接地址"/>
								</div>
							</div>
							<div className={css["tab-panel"]} style={this.state.picModal === 'local'?{display:'block'}:{display:'none'}}>
								<div className={css["btn-group"]}>
									<div className={css.label}>
										<b>选择图片</b>
									</div>
									<input className={css.inputFile} type='file' accept="image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png" />
									<button className={css.btnUpload}>上传</button>
									<p className={css.tips}>1、图片大小不能超过2M，2、支持格式：.jpg .gif .png .bmp。</p>
									<div className={css["preview-box"]}></div>
								</div>
							</div>
						</div>
						<div className={css["modal-footer"]}>
							<button className={css.cancelbtn} onClick={(e)=>{this._toggleUploadModal(e)}}>取消</button>
							<button className={css.submitbtn}>确认</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
