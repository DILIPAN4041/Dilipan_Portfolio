import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { Profile, Skill, Project, Experience, Blog, FunFact, Contact, SiteSettings } from '../core/models';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    constructor(private api: ApiService) { }

    // Profile
    getProfile(): Observable<Profile> {
        return this.api.get<Profile>('profile').pipe(map(res => res.data!));
    }

    updateProfile(profile: Partial<Profile>): Observable<Profile> {
        return this.api.put<Profile>('profile', profile).pipe(map(res => res.data!));
    }

    // Skills
    getSkills(): Observable<Skill[]> {
        return this.api.get<Skill[]>('skills').pipe(map(res => res.data!));
    }

    getAllSkills(): Observable<Skill[]> {
        return this.api.get<Skill[]>('skills/all').pipe(map(res => res.data!));
    }

    getSkill(id: string): Observable<Skill> {
        return this.api.get<Skill>(`skills/${id}`).pipe(map(res => res.data!));
    }

    createSkill(skill: Partial<Skill>): Observable<Skill> {
        return this.api.post<Skill>('skills', skill).pipe(map(res => res.data!));
    }

    updateSkill(id: string, skill: Partial<Skill>): Observable<Skill> {
        return this.api.put<Skill>(`skills/${id}`, skill).pipe(map(res => res.data!));
    }

    deleteSkill(id: string): Observable<void> {
        return this.api.delete<void>(`skills/${id}`).pipe(map(() => undefined));
    }

    // Projects
    getProjects(): Observable<Project[]> {
        return this.api.get<Project[]>('projects').pipe(map(res => res.data!));
    }

    getAllProjects(): Observable<Project[]> {
        return this.api.get<Project[]>('projects/all').pipe(map(res => res.data!));
    }

    getProject(id: string): Observable<Project> {
        return this.api.get<Project>(`projects/${id}`).pipe(map(res => res.data!));
    }

    createProject(project: Partial<Project>): Observable<Project> {
        return this.api.post<Project>('projects', project).pipe(map(res => res.data!));
    }

    updateProject(id: string, project: Partial<Project>): Observable<Project> {
        return this.api.put<Project>(`projects/${id}`, project).pipe(map(res => res.data!));
    }

    deleteProject(id: string): Observable<void> {
        return this.api.delete<void>(`projects/${id}`).pipe(map(() => undefined));
    }

    // Experience
    getExperience(): Observable<Experience[]> {
        return this.api.get<Experience[]>('experience').pipe(map(res => res.data!));
    }

    getAllExperience(): Observable<Experience[]> {
        return this.api.get<Experience[]>('experience/all').pipe(map(res => res.data!));
    }

    getExperienceById(id: string): Observable<Experience> {
        return this.api.get<Experience>(`experience/${id}`).pipe(map(res => res.data!));
    }

    createExperience(experience: Partial<Experience>): Observable<Experience> {
        return this.api.post<Experience>('experience', experience).pipe(map(res => res.data!));
    }

    updateExperience(id: string, experience: Partial<Experience>): Observable<Experience> {
        return this.api.put<Experience>(`experience/${id}`, experience).pipe(map(res => res.data!));
    }

    deleteExperience(id: string): Observable<void> {
        return this.api.delete<void>(`experience/${id}`).pipe(map(() => undefined));
    }

    // Blogs
    getBlogs(): Observable<Blog[]> {
        return this.api.get<Blog[]>('blogs').pipe(map(res => res.data!));
    }

    getAllBlogs(): Observable<Blog[]> {
        return this.api.get<Blog[]>('blogs/all').pipe(map(res => res.data!));
    }

    getBlog(slugOrId: string): Observable<Blog> {
        return this.api.get<Blog>(`blogs/${slugOrId}`).pipe(map(res => res.data!));
    }

    createBlog(blog: Partial<Blog>): Observable<Blog> {
        return this.api.post<Blog>('blogs', blog).pipe(map(res => res.data!));
    }

    updateBlog(id: string, blog: Partial<Blog>): Observable<Blog> {
        return this.api.put<Blog>(`blogs/${id}`, blog).pipe(map(res => res.data!));
    }

    deleteBlog(id: string): Observable<void> {
        return this.api.delete<void>(`blogs/${id}`).pipe(map(() => undefined));
    }

    // Fun Facts
    getFunFacts(): Observable<FunFact[]> {
        return this.api.get<FunFact[]>('funfacts').pipe(map(res => res.data!));
    }

    getAllFunFacts(): Observable<FunFact[]> {
        return this.api.get<FunFact[]>('funfacts/all').pipe(map(res => res.data!));
    }

    createFunFact(funfact: Partial<FunFact>): Observable<FunFact> {
        return this.api.post<FunFact>('funfacts', funfact).pipe(map(res => res.data!));
    }

    updateFunFact(id: string, funfact: Partial<FunFact>): Observable<FunFact> {
        return this.api.put<FunFact>(`funfacts/${id}`, funfact).pipe(map(res => res.data!));
    }

    deleteFunFact(id: string): Observable<void> {
        return this.api.delete<void>(`funfacts/${id}`).pipe(map(() => undefined));
    }

    // Contact
    getContact(): Observable<Contact> {
        return this.api.get<Contact>('contact').pipe(map(res => res.data!));
    }

    updateContact(contact: Partial<Contact>): Observable<Contact> {
        return this.api.put<Contact>('contact', contact).pipe(map(res => res.data!));
    }

    submitContactForm(formData: { name: string; email: string; message: string }): Observable<any> {
        return this.api.post<any>('contact/submit', formData).pipe(map(res => res));
    }

    // Contact Messages (Admin)
    getContactMessages(): Observable<any> {
        return this.api.get<any>('contact/messages').pipe(map(res => res));
    }

    markMessageAsRead(id: string, isRead: boolean): Observable<any> {
        return this.api.patch<any>(`contact/messages/${id}/read`, { isRead }).pipe(map(res => res));
    }

    deleteContactMessage(id: string): Observable<any> {
        return this.api.delete<any>(`contact/messages/${id}`).pipe(map(res => res));
    }

    // Settings
    getSettings(): Observable<SiteSettings> {
        return this.api.get<SiteSettings>('settings').pipe(map(res => res.data!));
    }

    updateSettings(settings: Partial<SiteSettings>): Observable<SiteSettings> {
        return this.api.put<SiteSettings>('settings', settings).pipe(map(res => res.data!));
    }

    // Helper methods
    getBlogBySlug(slug: string): Observable<any> {
        return this.api.get<any>(`blogs/${slug}`).pipe(map(res => res.data!));
    }

    getProjectById(id: string): Observable<any> {
        return this.api.get<any>(`projects/${id}`).pipe(map(res => res.data!));
    }
}
