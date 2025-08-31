export class LayoutManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.screenSize = this.getScreenSize();
        this.layout = this.calculateLayout();
        this.priorityLevels = {
            'essential': 1,    // Health bars, fighters, basic controls
            'important': 2,    // Commentary, MARX branding
            'nice_to_have': 3, // Achievements, rigging stats
            'luxury': 4        // Extra animations, detailed stats
        };
    }
    
    getScreenSize() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        if (width < 1440) return 'desktop';
        return 'large';
    }
    
    calculateLayout() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const size = this.screenSize;
        
        const layouts = {
            mobile: {
                // Mobile: Only show essentials
                healthBars: { x: 10, y: 10, width: w - 20, height: 40, show: true },
                fighters: { x: 50, y: h * 0.4, width: w - 100, height: h * 0.3, show: true },
                controls: { show: true }, // Already responsive
                marxLogo: { x: w - 80, y: 10, width: 70, height: 50, show: true },
                
                // Hide complex elements on mobile
                commentary: { show: false },
                achievements: { show: false },
                riggingStats: { show: false },
                roundInfo: { x: w/2, y: h - 60, show: true }
            },
            
            tablet: {
                // Tablet: Show most elements but simplified
                healthBars: { x: 20, y: 20, width: w - 40, height: 40, show: true },
                fighters: { x: 80, y: h * 0.45, width: w - 160, height: h * 0.3, show: true },
                controls: { show: true },
                marxLogo: { x: w - 120, y: 20, width: 100, height: 60, show: true },
                
                commentary: { x: 20, y: h - 120, width: w - 40, height: 60, show: true },
                achievements: { x: w - 250, y: 100, width: 230, height: 200, show: true },
                riggingStats: { x: 20, y: h - 180, width: 200, height: 50, show: true },
                roundInfo: { x: w/2, y: h - 200, show: true }
            },
            
            desktop: {
                // Desktop: Show everything with good spacing
                healthBars: { x: 50, y: 40, width: w - 100, height: 40, show: true },
                fighters: { x: 100, y: h * 0.45, width: w - 200, height: h * 0.3, show: true },
                controls: { show: true },
                marxLogo: { x: w - 150, y: 20, width: 130, height: 70, show: true },
                
                commentary: { x: 15, y: h - 150, width: w - 30, height: 60, show: true },
                achievements: { x: w - 300, y: 150, width: 280, height: 300, show: true },
                riggingStats: { x: 20, y: h - 220, width: 250, height: 60, show: true },
                roundInfo: { x: w/2, y: h - 240, show: true },
                
                // Desktop extras
                marxBranding: { x: w/2, y: 60, show: true },
                extraEffects: { show: true }
            },
            
            large: {
                // Large screens: Show everything with maximum detail
                healthBars: { x: 50, y: 40, width: w - 100, height: 40, show: true },
                fighters: { x: 150, y: h * 0.45, width: w - 300, height: h * 0.3, show: true },
                controls: { show: true },
                marxLogo: { x: w - 180, y: 20, width: 160, height: 80, show: true },
                
                commentary: { x: 15, y: h - 150, width: w - 30, height: 60, show: true },
                achievements: { x: w - 350, y: 120, width: 330, height: 400, show: true },
                riggingStats: { x: 20, y: h - 240, width: 300, height: 80, show: true },
                roundInfo: { x: w/2, y: h - 260, show: true },
                
                // Large screen extras
                marxBranding: { x: w/2, y: 60, show: true },
                extraEffects: { show: true },
                detailedStats: { x: 20, y: 120, width: 200, height: 100, show: true }
            }
        };
        
        return layouts[size] || layouts.desktop;
    }
    
    shouldShow(elementName, priority = 'nice_to_have') {
        const element = this.layout[elementName];
        if (!element) return false;
        
        // Always show essential elements
        if (priority === 'essential') return true;
        
        // Screen size based filtering
        const showLevels = {
            mobile: ['essential'],
            tablet: ['essential', 'important'],
            desktop: ['essential', 'important', 'nice_to_have'],
            large: ['essential', 'important', 'nice_to_have', 'luxury']
        };
        
        return element.show && showLevels[this.screenSize].includes(priority);
    }
    
    getPosition(elementName) {
        return this.layout[elementName] || { x: 0, y: 0, show: false };
    }
    
    getRelativePosition(elementName, relativeX = 0, relativeY = 0) {
        const pos = this.getPosition(elementName);
        return {
            x: pos.x + relativeX,
            y: pos.y + relativeY,
            show: pos.show
        };
    }
    
    // Dynamic spacing based on screen size
    getSpacing() {
        const spacings = {
            mobile: { small: 5, medium: 10, large: 15 },
            tablet: { small: 8, medium: 15, large: 25 },
            desktop: { small: 10, medium: 20, large: 35 },
            large: { small: 15, medium: 25, large: 50 }
        };
        
        return spacings[this.screenSize] || spacings.desktop;
    }
    
    // Font sizes based on screen
    getFontSize(baseSize = 12) {
        const multipliers = {
            mobile: 0.7,
            tablet: 0.85,
            desktop: 1.0,
            large: 1.2
        };
        
        return Math.floor(baseSize * (multipliers[this.screenSize] || 1.0));
    }
    
    // Update layout when screen resizes
    updateLayout() {
        const newScreenSize = this.getScreenSize();
        if (newScreenSize !== this.screenSize) {
            this.screenSize = newScreenSize;
            this.layout = this.calculateLayout();
            return true; // Layout changed
        }
        return false; // No change
    }
    
    // Check if element fits in available space
    checkFit(elementName, width, height) {
        const pos = this.getPosition(elementName);
        if (!pos.show) return false;
        
        return (pos.x + width <= this.canvas.width) && 
               (pos.y + height <= this.canvas.height);
    }
    
    // Get optimal text wrapping width
    getTextWidth(elementName, fallbackWidth = 200) {
        const pos = this.getPosition(elementName);
        return pos.width || fallbackWidth;
    }
    
    // Priority-based element display
    getVisibleElements() {
        const visible = [];
        
        // Always show essential elements
        ['healthBars', 'fighters', 'controls'].forEach(element => {
            if (this.shouldShow(element, 'essential')) {
                visible.push(element);
            }
        });
        
        // Show important elements if space allows
        ['commentary', 'marxLogo'].forEach(element => {
            if (this.shouldShow(element, 'important')) {
                visible.push(element);
            }
        });
        
        // Show nice-to-have elements on larger screens
        ['achievements', 'riggingStats', 'roundInfo'].forEach(element => {
            if (this.shouldShow(element, 'nice_to_have')) {
                visible.push(element);
            }
        });
        
        // Show luxury elements only on large screens
        ['marxBranding', 'extraEffects', 'detailedStats'].forEach(element => {
            if (this.shouldShow(element, 'luxury')) {
                visible.push(element);
            }
        });
        
        return visible;
    }
    
    // Responsive breakpoint helpers
    isMobile() { return this.screenSize === 'mobile'; }
    isTablet() { return this.screenSize === 'tablet'; }
    isDesktop() { return this.screenSize === 'desktop'; }
    isLarge() { return this.screenSize === 'large'; }
    
    // Get safe drawing area (avoiding UI elements)
    getSafeArea() {
        const spacing = this.getSpacing();
        return {
            x: spacing.large,
            y: this.layout.healthBars.y + this.layout.healthBars.height + spacing.medium,
            width: this.canvas.width - (spacing.large * 2),
            height: this.canvas.height - 300 // Reserve space for UI
        };
    }
}
