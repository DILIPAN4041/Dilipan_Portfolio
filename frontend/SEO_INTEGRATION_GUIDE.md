// Quick SEO Integration Script
// Add this to each component's constructor and ngOnInit

// 1. Import statements (add to top of file)
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

// 2. Inject in constructor
constructor(
  private contentService: ContentService,
  private meta: MetaService
) { }

// 3. Add to ngOnInit (first line)
ngOnInit() {
  // SEO - replace 'home' with appropriate page key
  this.meta.updateTags(SEO_CONFIG.home);
  
  // ... rest of existing code
}

// Page keys for SEO_CONFIG:
// - home
// - about
// - projects
// - skills
// - contact
// - experience
// - blogs
// - funFacts
