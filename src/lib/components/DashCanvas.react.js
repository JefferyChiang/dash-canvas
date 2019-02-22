import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SketchField, Tools} from 'react-sketch';
import {ZoomMinusIcon, ZoomPlusIcon, EditIcon, PanIcon,
	ArrowLeftIcon, PlotLineIcon} from 'plotly-icons';


const styles = {
    button: {
	margin: '3px',
        padding: '0px',
	width: '50px',
	height: '50px',
	verticalAlign: 'middle',
    },

    textbutton:{
	verticalAlign: 'top',
	height: '50px',
	color: 'blue',
	verticalAlign: 'middle',
	}
};

/**
 * Canvas component for drawing on a background image and selecting
 * regions.
 */
export default class DashCanvas extends Component {
    constructor(props) {
    super(props);
    this.state = {
    };
    this._save = this._save.bind(this);
    this._undo = this._undo.bind(this);
    this._zoom = this._zoom.bind(this);
    this._zoom_factor = this._zoom_factor.bind(this);
    this._unzoom = this._unzoom.bind(this);
    this._pantool = this._pantool.bind(this);
    this._penciltool = this._penciltool.bind(this);
    this._linetool = this._linetool.bind(this);
  } 


    componentDidMount() {
    if (this.props.filename.length > 0){
	let sketch = this._sketch;
	let opts = {left:0,
		    top:0,
		    scale:this.props.scale}
	sketch.addImg(this.props.filename, opts);
	}
    if (this.props.image_content.length > 0){
	let sketch = this._sketch;
	sketch.clear()
	let opts = {left:0,
		    top:0,
		    scale:this.props.scale}
	sketch.addImg(this.props.image_content, opts);
	}
    }


    componentDidUpdate(prevProps) {
    let sketch = this._sketch;
    // Typical usage (don't forget to compare props):
    if (
	(this.props.image_content !== prevProps.image_content)){
	sketch.clear();
	this.props.setProps({json_data: ''});
	let opts = {left:0,
	 	    top:0,
	            scale:this.props.scale}
	sketch.addImg(this.props.image_content, opts);
	sketch._fc.setZoom(this.props.zoom);
    };
    };


    _save() {
        let JSON_string = JSON.stringify(this._sketch.toJSON());
	let toggle_value = this.props.trigger + 1
	this.props.setProps({json_data: JSON_string, trigger: toggle_value});
    };


    _undo(){
        this._sketch.undo();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };

    _zoom_factor(factor){
	console.log("called zoom");
	this._sketch.zoom(factor);
	let zoom_factor = this.props.zoom;
	this.props.setProps({zoom: factor*zoom_factor})
	console.log(this.props.zoom);
    };


    _zoom(){
	this._sketch.zoom(1.25);
	let zoom_factor = this.props.zoom;
	this.props.setProps({zoom: 1.25*zoom_factor})
    };
   

    _unzoom(){
	this._sketch.zoom(0.8);
	let zoom_factor = this.props.zoom;
	this.props.setProps({zoom: 0.8*zoom_factor});
    };


    _pantool(){
	this.props.setProps({tool: "pan"});
	};


    _penciltool(){
	this.props.setProps({tool: "pencil"});
	};


    _linetool(){
	this.props.setProps({tool: "line"});
	};



    render() {
        console.log("rendered");
        var toolsArray = {};
        toolsArray["pencil"] = Tools.Pencil;
        toolsArray["pan"] = Tools.Pan;
        toolsArray["line"] = Tools.Line;
        toolsArray["circle"] = Tools.Circle;
        toolsArray["select"] = Tools.Select;
        return (
	    <div className={this.props.className}>
	    <SketchField name='sketch'
		ref={(c) => this._sketch = c}
                tool={toolsArray[this.props.tool.toLowerCase()]}
                lineColor={this.props.lineColor}
		width={this.props.width}
		height={this.props.height}
		forceValue={true}
                lineWidth={this.props.lineWidth}/>
	    <button style={styles.button}
		    title="Zoom in"
		    onClick={(e) => this._zoom()}>
		<ZoomPlusIcon/>
	    </button>
	    <button style={styles.button}
		    title="Zoom out"
		    onClick={(e) => this._unzoom()}>
		<ZoomMinusIcon/>
	    </button>
	    <button style={styles.button}
		    title="Brush tool"
		    onClick={(e) => this._penciltool()}>
		<EditIcon/>
	    </button>
	    <button style={styles.button}
		    title="Line tool"
		    onClick={(e) => this._linetool()}>
		<PlotLineIcon/>
	    </button>

	    <button style={styles.button}
		    title="Pan"
		    onClick={(e) => this._pantool()}>
		<PanIcon/>
	    </button>
	    <button style={styles.button}
		    title="Undo"
		    onClick={(e) => this._undo()}>
		<ArrowLeftIcon/>
	    </button>
	    <button style={styles.textbutton} 
		    onClick={(e) => this._save()}> 
		    {this.props.goButtonTitle} 
	    </button>

	    </div>

        )
     }


}

DashCanvas.defaultProps = {filename:'', label:'',
			   json_data:'', image_content:'', trigger:0,
			   width:500, height:500, scale:1, lineWidth:20,
			   lineColor:'yellow', tool:"pencil", zoom:1,
			   goButtonTitle:'Save'};

DashCanvas.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks
     */
    id: PropTypes.string,

    /**
     * A label that will be printed when this component is rendered.
     */
    label: PropTypes.string.isRequired,

    /**
     * Image data string, formatted as png or jpg data string. Can be
     * generated by utils.io_utils.array_to_data_string.
     */
    image_content: PropTypes.string,
 
    /**
     * Zoom factor
     */
    zoom: PropTypes.number,
 

    /**
     * Width of the canvas
     */
    width: PropTypes.number,
 
     /**
     * Height of the canvas
     */
    height: PropTypes.number,

    /**
     * Scaling ratio between canvas width and image width
     */
    scale: PropTypes.number,
 
    /**
     * Selection of drawing tool, among ["pencil", "pan", "circle",
     * "select"].
     */
    tool: PropTypes.string,
 
    /**
     * Width of drawing line (in pencil mode)
     */
    lineWidth: PropTypes.number,

    /**
     * Color of drawing line (in pencil mode). Can be a text string,
     * like 'yellow', 'red', or a color triplet like 'rgb(255, 0, 0)'.
     * Alpha is possible with 'rgba(255, 0, 0, 0.5)'.
     */
    lineColor: PropTypes.string,

    /**
     * Title of button 
     * 
     * 
     */
    goButtonTitle: PropTypes.string,


    /**
     * Name of image file to load (URL string)
     */
    filename: PropTypes.string,


    /**
     * Counter of how many times the save button was pressed
     * (to be used mostly as input)
     */
    trigger: PropTypes.number,
    
    /**
     * Sketch content as JSON string, containing background image and
     * annotations. Use utils.parse_json.parse_jsonstring to parse
     * this string.
     */
    json_data: PropTypes.string,
    
    /**
     * Dash-assigned callback that should be called whenever any of the
     * properties change
     */
    setProps: PropTypes.func
};
