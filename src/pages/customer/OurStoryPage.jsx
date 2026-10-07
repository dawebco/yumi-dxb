import { Link } from "react-router-dom";
import SectionTitle from "../../components/common/SectionTitle";

export default function OurStory() {
  return (
    <div className="bg-[#FAF8F5] pb-24">
      {/* Intro Section: ABOUT YUMI */}
      <section id="about-yumi" className="pt-20 pb-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Media Placeholder */}
            <div className="w-full h-[500px] lg:h-[650px] rounded-[32px] bg-[#EAE6E1] border-2 border-dashed border-[#B89B72] flex flex-col items-center justify-center p-8 text-center text-[#6A625B]">
              <span className="text-4xl mb-4">📷 / 🎥</span>
              <p className="font-medium text-lg">Media space:</p>
              <p className="mt-2">Portrait/image of the two sisters<br/>Short video of the sisters together / behind-the-scenes moments</p>
            </div>

            {/* Content */}
            <div>
              <SectionTitle
                subtitle="About Yumi"
                title="Two Sisters. One Idea. One Beautiful Journey."
                center={false}
              />
              <p className="text-[#6A625B] leading-9 text-lg mt-6">
                Yumi began with a simple idea shared by two sisters — to create clothing that feels as good as it looks.
                <br /><br />
                What started as conversations about comfort, fabrics, colours and beautiful designs slowly grew into something more. They wanted to create pieces that women would genuinely enjoy wearing at home and in their everyday lives.
                <br /><br />
                With a shared love for fashion and an eye for quality, the sisters began exploring fabrics, experimenting with designs and understanding what makes a garment truly comfortable.
                <br /><br />
                And that's where the Yumi journey began.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01 — THE MATERIAL */}
      <section id="the-material" className="py-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <SectionTitle
                subtitle="01 — THE MATERIAL"
                title="It Starts With the Right Fabric"
                center={false}
              />
              <p className="text-[#6A625B] leading-9 text-lg mt-6">
                Every Yumi piece begins with the fabric.
                <br /><br />
                We personally touch, feel and experience the fabric before selecting it for our collections. We look for materials that feel soft against the skin, flow beautifully and offer the quality and comfort we expect from an export-quality product.
              </p>
            </div>

            {/* Media Placeholder */}
            <div className="order-1 lg:order-2 w-full h-[400px] lg:h-[500px] rounded-[32px] bg-[#EAE6E1] border-2 border-dashed border-[#B89B72] flex flex-col items-center justify-center p-8 text-center text-[#6A625B]">
              <span className="text-4xl mb-4">📷 / 🎥</span>
              <p className="font-medium text-lg">Media space:</p>
              <p className="mt-2">Fabric selection / material photographs<br/>Video of the sisters selecting and feeling different fabrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — THE CRAFT */}
      <section id="the-craft" className="py-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Media Placeholder */}
            <div className="w-full h-[400px] lg:h-[500px] rounded-[32px] bg-[#EAE6E1] border-2 border-dashed border-[#B89B72] flex flex-col items-center justify-center p-8 text-center text-[#6A625B]">
              <span className="text-4xl mb-4">📷 / 🎥</span>
              <p className="font-medium text-lg">Media space:</p>
              <p className="mt-2">Tailor / stitching photograph<br/>Tailoring and manufacturing video</p>
            </div>

            {/* Content */}
            <div>
              <SectionTitle
                subtitle="02 — THE CRAFT"
                title="From Fabric to Garment"
                center={false}
              />
              <p className="text-[#6A625B] leading-9 text-lg mt-6">
                Once the right material is selected, it goes through the hands of skilled tailors who bring the sisters' ideas to life.
                <br /><br />
                From cutting and stitching to the final finishing, every stage is handled with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — THE DESIGN */}
      <section id="the-design" className="py-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <SectionTitle
                subtitle="03 — THE DESIGN"
                title="Designed With Women in Mind"
                center={false}
              />
              <p className="text-[#6A625B] leading-9 text-lg mt-6">
                The sisters wanted to create pieces that weren't just beautiful, but genuinely comfortable to live in.
                <br /><br />
                From Dubai-style nighties to elegant kaftans and effortless co-ord sets, every design is created with comfort, fit and everyday practicality in mind.
              </p>
            </div>

            {/* Media Placeholder */}
            <div className="order-1 lg:order-2 w-full h-[400px] lg:h-[500px] rounded-[32px] bg-[#EAE6E1] border-2 border-dashed border-[#B89B72] flex flex-col items-center justify-center p-8 text-center text-[#6A625B]">
              <span className="text-4xl mb-4">📷 / 🎥</span>
              <p className="font-medium text-lg">Media space:</p>
              <p className="mt-2">Designs / sketches / garments<br/>Designing or product development video</p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — THE DETAILS */}
      <section id="the-details" className="py-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Media Placeholder */}
            <div className="w-full h-[400px] lg:h-[500px] rounded-[32px] bg-[#EAE6E1] border-2 border-dashed border-[#B89B72] flex flex-col items-center justify-center p-8 text-center text-[#6A625B]">
              <span className="text-4xl mb-4">📷 / 🎥</span>
              <p className="font-medium text-lg">Media space:</p>
              <p className="mt-2">Close-up product/detail images<br/>Close-up video of fabric, stitching and finishing</p>
            </div>

            {/* Content */}
            <div>
              <SectionTitle
                subtitle="04 — THE DETAILS"
                title="It's the Little Things"
                center={false}
              />
              <p className="text-[#6A625B] leading-9 text-lg mt-6">
                The fabric. The stitching. The fall. The fit. The finishing.
                <br /><br />
                Every detail matters because these are the things that make a garment feel special when you actually wear it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — THE YUMI COLLECTION */}
      <section id="the-collection" className="py-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <SectionTitle
                subtitle="05 — THE YUMI COLLECTION"
                title="Made for the Moments That Matter"
                center={false}
              />
              <p className="text-[#6A625B] leading-9 text-lg mt-6">
                Our nighties are made for everyday moments at home — relaxing, cooking, spending time with family or simply enjoying your own space.
                <br /><br />
                Our kaftans bring together comfort and elegance, while our co-ord sets make everyday dressing effortless and stylish.
                <br /><br />
                Different collections, one philosophy:
                <br />
                <span className="font-medium text-[#465348]">When you wear it, you should feel good.</span>
              </p>
            </div>

            {/* Media Placeholder */}
            <div className="order-1 lg:order-2 w-full h-[400px] lg:h-[500px] rounded-[32px] bg-[#EAE6E1] border-2 border-dashed border-[#B89B72] flex flex-col items-center justify-center p-8 text-center text-[#6A625B]">
              <span className="text-4xl mb-4">📷 / 🎥</span>
              <p className="font-medium text-lg">Media space:</p>
              <p className="mt-2">Lifestyle/model shoot<br/>Collection/lifestyle video</p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — OUR PROMISE */}
      <section id="our-promise" className="py-15">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionTitle
            subtitle="06 — OUR PROMISE"
            title="More Than Just a Garment"
            center={true}
          />
          <p className="text-[#6A625B] leading-9 text-lg mt-6">
            We don't want you to simply buy something from Yumi.<br />
            We want you to touch it, feel it, wear it — and feel that you made the right choice.
          </p>
          
          <div className="mt-12 mb-12 text-[#B89B72] font-serif text-2xl md:text-3xl leading-relaxed">
            <p>Soft to touch.</p>
            <p>Beautiful to wear.</p>
            <p>Comfortable to live in.</p>
          </div>

          <h3 className="text-3xl font-serif text-[#465348] mb-10">
            Yumi — Comfort You Can Feel.
          </h3>

          <Link
            to="/shop"
            className="inline-block px-10 py-4 rounded-full bg-[#465348] text-white hover:bg-[#39443A] transition shadow-lg"
          >
            Explore Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}