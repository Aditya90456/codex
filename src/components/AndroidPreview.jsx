import { useState, useEffect, useMemo } from 'react';
import { Smartphone, RefreshCw, Code } from 'lucide-react';

const AndroidPreview = ({ files, activeFile }) => {
  const [previewContent, setPreviewContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Create a reactive key based on file contentJOOOOPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPJKLLLLLLL;;;;;'[;;;;;;;;;;;;;;;;;;;;L
  const fileContentKey = useMemo(() => {
    const content = files[activeFile]?.content || '';
    const lastModified = files[activeFile]?.lastModified || Date.now();
    return `${activeFile}-${content.length}-${lastModified}`;
  }, [files, activeFile]);

  // Force regeneration when files change or content changes
  useEffect(() => {
    console.log('🔄 AndroidPreview: Files changed, regenerating preview');
    generatePreview();
  }, [fileContentKey]);

  // Also regenerate when active file changes
  useEffect(() => {
    console.log('📂 AndroidPreview: Active file changed to', activeFile);
    generatePreview();
  }, [activeFile]);

  const generatePreview = async () => {
    setIsGenerating(true);
    
    // Immediate preview generation for real-time updates
    setTimeout(() => {
      try {
        const preview = createPreviewFromCode();
        setPreviewContent(preview);
        console.log('✅ AndroidPreview: Preview generated successfully', preview);
      } catch (error) {
        console.error('❌ AndroidPreview: Error generating preview', error);
        setPreviewContent(null);
      } finally {
        setIsGenerating(false);
      }
    }, 100); // Very fast response - 100ms
  };

  const createPreviewFromCode = () => {
    const javaFile = files['MainActivity.java'];
    const xmlFile = files['activity_main.xml'];
    
    if (!javaFile && !xmlFile) return null;

    // Enhanced comprehensive XML analysis
    const javaContent = javaFile?.content || '';
    const xmlContent = xmlFile?.content || '';
    
    console.log('🔍 Analyzing XML content:', xmlContent.substring(0, 200) + '...');
    
    // Comprehensive UI element detection
    const elements = {
      TextView: xmlContent.includes('TextView'),
      Button: xmlContent.includes('Button'),
      EditText: xmlContent.includes('EditText'),
      ImageView: xmlContent.includes('ImageView'),
      ImageButton: xmlContent.includes('ImageButton'),
      CheckBox: xmlContent.includes('CheckBox'),
      RadioButton: xmlContent.includes('RadioButton'),
      Switch: xmlContent.includes('Switch'),
      ProgressBar: xmlContent.includes('ProgressBar'),
      SeekBar: xmlContent.includes('SeekBar'),
      Spinner: xmlContent.includes('Spinner'),
      RecyclerView: xmlContent.includes('RecyclerView'),
      ListView: xmlContent.includes('ListView'),
      ScrollView: xmlContent.includes('ScrollView'),
      CardView: xmlContent.includes('CardView'),
      FloatingActionButton: xmlContent.includes('FloatingActionButton'),
      Toolbar: xmlContent.includes('Toolbar'),
      AppBarLayout: xmlContent.includes('AppBarLayout')
    };
    
    // Layout analysis
    const layouts = {
      LinearLayout: xmlContent.includes('LinearLayout'),
      ConstraintLayout: xmlContent.includes('ConstraintLayout'),
      RelativeLayout: xmlContent.includes('RelativeLayout'),
      FrameLayout: xmlContent.includes('FrameLayout'),
      GridLayout: xmlContent.includes('GridLayout'),
      CoordinatorLayout: xmlContent.includes('CoordinatorLayout')
    };
    
    // Extract all text content
    const textContents = [];
    const textMatches = xmlContent.matchAll(/android:text="([^"]+)"/g);
    for (const match of textMatches) {
      textContents.push(match[1]);
    }
    
    // Extract all hint content
    const hintContents = [];
    const hintMatches = xmlContent.matchAll(/android:hint="([^"]+)"/g);
    for (const match of hintMatches) {
      hintContents.push(match[1]);
    }
    
    // Color analysis
    const colors = {
      textColor: xmlContent.match(/android:textColor="([^"]+)"/)?.[1],
      backgroundColor: xmlContent.match(/android:background="([^"]+)"/)?.[1],
      tint: xmlContent.match(/android:tint="([^"]+)"/)?.[1]
    };
    
    // Size and dimension analysis
    const dimensions = {
      textSize: xmlContent.match(/android:textSize="([^"]+)"/)?.[1],
      width: xmlContent.match(/android:layout_width="([^"]+)"/)?.[1],
      height: xmlContent.match(/android:layout_height="([^"]+)"/)?.[1],
      padding: xmlContent.match(/android:padding="([^"]+)"/)?.[1],
      margin: xmlContent.match(/android:layout_margin="([^"]+)"/)?.[1]
    };
    
    // Style analysis
    const styling = {
      textStyle: xmlContent.match(/android:textStyle="([^"]+)"/)?.[1],
      gravity: xmlContent.match(/android:gravity="([^"]+)"/)?.[1],
      orientation: xmlContent.match(/android:orientation="([^"]+)"/)?.[1],
      visibility: xmlContent.match(/android:visibility="([^"]+)"/)?.[1]
    };
    
    // Advanced attributes
    const attributes = {
      id: xmlContent.match(/android:id="@\+id\/([^"]+)"/)?.[1],
      src: xmlContent.match(/android:src="([^"]+)"/)?.[1],
      contentDescription: xmlContent.match(/android:contentDescription="([^"]+)"/)?.[1],
      enabled: xmlContent.match(/android:enabled="([^"]+)"/)?.[1],
      clickable: xmlContent.match(/android:clickable="([^"]+)"/)?.[1]
    };
    
    // Constraint Layout specific
    const constraints = {
      startToStart: xmlContent.includes('app:layout_constraintStart_toStartOf'),
      endToEnd: xmlContent.includes('app:layout_constraintEnd_toEndOf'),
      topToTop: xmlContent.includes('app:layout_constraintTop_toTopOf'),
      bottomToBottom: xmlContent.includes('app:layout_constraintBottom_toBottomOf')
    };
    
    // Count elements
    const elementCounts = {};
    Object.keys(elements).forEach(element => {
      const matches = xmlContent.match(new RegExp(`<${element}`, 'g'));
      elementCounts[element] = matches ? matches.length : 0;
    });
    
    // Determine primary layout
    const primaryLayout = Object.keys(layouts).find(layout => layouts[layout]) || 'LinearLayout';
    
    return {
      elements,
      layouts,
      textContents,
      hintContents,
      colors,
      dimensions,
      styling,
      attributes,
      constraints,
      elementCounts,
      primaryLayout,
      hasCustomStyling: Object.values(colors).some(Boolean) || Object.values(styling).some(Boolean),
      totalElements: Object.values(elementCounts).reduce((sum, count) => sum + count, 0),
      codeLength: javaContent.length + xmlContent.length,
      lastModified: Date.now(),
      xmlAnalysis: {
        hasNamespace: xmlContent.includes('xmlns:android'),
        hasAppNamespace: xmlContent.includes('xmlns:app'),
        hasToolsNamespace: xmlContent.includes('xmlns:tools'),
        rootElement: xmlContent.match(/<(\w+)/)?.[1] || 'Unknown'
      }
    };
  };

  if (isGenerating) {
    return (
      <div className="h-full flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center justify-center text-center p-8">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-2 border-blue-100 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating Preview</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Analyzing your Android code and creating live preview...
          </p>
          <div className="mt-4 flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-700 font-medium">Processing</span>
          </div>
        </div>
      </div>
    );
  }

  if (!previewContent) {
    return (
      <div className="h-full flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center justify-center text-center p-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Smartphone className="w-10 h-10 text-gray-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-100 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-orange-600">?</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Preview Available</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-4">
            Start writing Android code to see a live preview of your app
          </p>
          <div className="bg-gray-50 px-4 py-2 rounded-lg border">
            <p className="text-xs text-gray-600">
              Add TextView, Button, or other UI elements to see them here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h4 className="font-medium text-gray-700">App Preview</h4>
        <button
          onClick={generatePreview}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh Preview"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      
      {/* Phone Frame - Perfect Centering */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-center w-full h-full">
          <div className="relative flex items-center justify-center">
            {/* Enhanced Phone Shadow with multiple layers */}
            <div className="absolute inset-0 w-56 h-[400px] bg-black/10 rounded-3xl blur-2xl transform translate-y-4 scale-105"></div>
            <div className="absolute inset-0 w-56 h-[400px] bg-black/20 rounded-3xl blur-xl transform translate-y-2"></div>
            
            {/* Phone Frame - Perfectly Centered */}
            <div className="relative w-56 h-[400px] bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 rounded-3xl p-2 shadow-2xl border border-gray-700 flex items-center justify-center">
              {/* Screen Container */}
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col relative shadow-inner">
                {/* Notch - Perfectly Centered */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-gray-800 rounded-full z-10"></div>
                
                {/* Status Bar */}
                <div className="h-10 bg-gray-900 flex items-center justify-between px-4 text-white text-xs pt-4 relative z-0">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    </div>
                    <span className="ml-2 font-medium">Codex Studio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">9:41</span>
                    <div className="w-7 h-4 border border-white rounded-sm relative">
                      <div className="w-5 h-1.5 bg-green-500 rounded-full mt-0.5 ml-0.5"></div>
                      <div className="absolute -right-0.5 top-1 w-0.5 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* App Content - Perfect Center Alignment */}
                <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 via-white to-gray-50 relative">
                  {/* Real-time update indicator - Better positioned */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">
                      {isGenerating ? 'Updating...' : 'Live'}
                    </span>
                  </div>

                  {/* Content Container - Shows All XML Changes */}
                  <div className="flex flex-col items-center justify-center space-y-3 w-full max-w-xs">
                    {/* Dynamic Text Views */}
                    {previewContent.textContents && previewContent.textContents.map((text, index) => (
                      <div key={`text-${index}`} className="text-center animate-fade-in">
                        <div className={`font-bold mb-1 ${
                          previewContent.colors.textColor ? 'text-purple-600' : 'text-gray-800'
                        } ${
                          previewContent.styling.textStyle === 'bold' ? 'font-bold' : 
                          previewContent.styling.textStyle === 'italic' ? 'italic' : ''
                        }`} style={{
                          fontSize: previewContent.dimensions.textSize ? '18px' : '16px',
                          color: previewContent.colors.textColor?.includes('#') ? previewContent.colors.textColor : undefined
                        }}>
                          {text}
                        </div>
                      </div>
                    ))}

                    {/* Dynamic Edit Text Fields */}
                    {previewContent.elements.EditText && previewContent.hintContents && previewContent.hintContents.map((hint, index) => (
                      <div key={`edit-${index}`} className="w-full">
                        <input 
                          type="text" 
                          placeholder={hint || "Enter text here..."}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                          style={{
                            backgroundColor: previewContent.colors.backgroundColor?.includes('#') ? previewContent.colors.backgroundColor : undefined
                          }}
                        />
                      </div>
                    ))}
                    
                    {/* Dynamic Buttons */}
                    {previewContent.elements.Button && (
                      <button className={`px-6 py-2.5 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-200 text-sm ${
                        previewContent.hasCustomStyling ? 'ring-2 ring-purple-300' : ''
                      }`} style={{
                        backgroundColor: previewContent.colors.backgroundColor?.includes('#') ? previewContent.colors.backgroundColor : '#3B82F6',
                        color: previewContent.colors.textColor?.includes('#') ? previewContent.colors.textColor : 'white'
                      }}>
                        {previewContent.textContents && previewContent.textContents.find(text => text.toLowerCase().includes('click') || text.toLowerCase().includes('button')) || 'Button'}
                      </button>
                    )}

                    {/* Dynamic Image Views */}
                    {previewContent.elements.ImageView && (
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs">IMG</span>
                      </div>
                    )}

                    {/* Dynamic CheckBoxes */}
                    {previewContent.elements.CheckBox && (
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Checkbox</span>
                      </div>
                    )}

                    {/* Dynamic Radio Buttons */}
                    {previewContent.elements.RadioButton && (
                      <div className="flex items-center space-x-2">
                        <input type="radio" className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Radio Option</span>
                      </div>
                    )}

                    {/* Dynamic Progress Bar */}
                    {previewContent.elements.ProgressBar && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                    )}

                    {/* Dynamic Switch */}
                    {previewContent.elements.Switch && (
                      <div className="flex items-center space-x-2">
                        <div className="relative inline-block w-10 h-6">
                          <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                          <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1 transition"></div>
                        </div>
                        <span className="text-sm text-gray-700">Switch</span>
                      </div>
                    )}

                    {/* Element Count Display */}
                    {previewContent.totalElements > 0 && (
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {previewContent.totalElements} UI elements • {previewContent.codeLength} chars
                      </div>
                    )}

                    {/* Fallback for basic elements */}
                    {(!previewContent.textContents || previewContent.textContents.length === 0) && 
                     (!previewContent.elements || !Object.values(previewContent.elements).some(Boolean)) && (
                      <div className="text-center text-gray-500">
                        <div className="text-sm">Add UI elements to see preview</div>
                      </div>
                    )}
                  </div>

                  {/* Comprehensive Layout Info */}
                  <div className="absolute bottom-3 left-3 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-full shadow-sm border">
                    {previewContent.primaryLayout} • {previewContent.totalElements || 0} elements
                  </div>

                  {/* XML Analysis Info */}
                  <div className="absolute top-3 left-3 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-full shadow-sm border">
                    {previewContent.xmlAnalysis?.rootElement || 'XML'} root
                  </div>

                  {/* App Icon - Better positioned */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Code className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Home Indicator - Perfectly Centered */}
              <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AndroidPreview;