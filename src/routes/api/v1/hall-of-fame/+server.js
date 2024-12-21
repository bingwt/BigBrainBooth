export async function GET() {
    const projects = [
        { title: 'Project 1', description: 'Description of project 1', link: 'http://example.com/1' },
        { title: 'Project 2', description: 'Description of project 2', link: 'http://example.com/2' },
    ];

    return new Response(JSON.stringify(projects), {
        headers: { 'Content-Type': 'application/json' }
    });
}
